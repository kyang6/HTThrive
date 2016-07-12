require 'csv'


CSV.open("./checklist_all_id_data.csv","wb") do |csv|
    Checklist.all.each do |chk|
        name = chk.name
        # only include checklists that are not focused on private
        if name.exclude? "Private"
         
            # belongs to person so for each checklist there will have multiple personal checks
            personal_checks = chk.personal_checks

            checks = []
            
            do_bool = false
            # go through every personal check and only add one copy of each check as a hash
            personal_checks.each do |pc|
                if pc.person_id.is_a? Numeric
                    if Person.exists?(pc.person_id)
                        if !Person.find(pc.person_id).email.nil?
                            if !Person.find(pc.person_id).email.include? "healthtap.com"
                                do_bool = true
                            end
                        end
                    end
                else
                    do_bool = true
                end

                if do_bool 
                    ppl_array = []
                    # check if there is a check with the same name
                    if checks.any? {|c| c[:check_name] == pc.name}
                        # find the check that has the same name
                        existing_check = checks.find {|ec| ec[:check_name] == pc.name}

                        # if the person_id is nil than put 0
                        if pc.person_id.nil?
                            existing_check[:people_array].push(0)
                        else
                            existing_check[:people_array].push(pc.person_id)
                        end
                        existing_check[:people_array].push(pc.completed)
                        # add to how many times the check has been checked
                        if(pc.completed)
                            existing_check[:total_checked] += 1
                        end
                        existing_check[:checks_participant_count] += 1
                    else
                        tot_checked = 0
                        if(pc.completed)
                            tot_checked = 1
                        end

                        if pc.person_id.nil?
                            ppl_array.push(0)
                        else
                            ppl_array.push(pc.person_id)
                        end
                        ppl_array.push(pc.completed)

                        # make a hash and push to the checks array 
                        new_check = {:check_name => pc.name, :freq => pc.frequency, :total_checked => tot_checked, :checks_participant_count => 1, :people_array => ppl_array}
                        checks.push(new_check)
                    end
                end
            end

            checks_array = []
            
            # convert the hashes into a flat array
            checks.each do |check|
                checks_array.push(check[:check_name])
                checks_array.push(check[:freq])
                checks_array.push(check[:total_checked])
                checks_array.push(check[:checks_participant_count])
                checks_array.push("^")
                checks_array.push(check[:people_array])
            end


            csv << [name, checks_array].flatten
        end
    end
end