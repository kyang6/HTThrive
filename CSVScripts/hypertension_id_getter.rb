require 'csv'

# Number of people to grab
people_limit = 8000

# returns people that have followed high blood pressure or hypertension or have had a consult regarding high blood pressure
CSV.open("./hypertension.csv","wb") do |csv|
    

    # Array of ids of people to email
    id_arr = []


    # This query grabs all users who have followed the condition Hypertension/high blood pressure
    ids = [111086592, 111057229]

    Follow.where(["followable_id in (?)", ids]).limit(people_limit).each do |followable|
        person = followable.follower
        id = person.id

        # Only add the person once 
        if !id_arr.include? id
            id_arr.push(id)
        end
    end
 
    # Grab all soap notes that mention hypertension in the subjective, objective, or the assessment
    hyper_ids = SoapDraft.where("subjective like '%hypertension%' or objective like '%hypertension%' or assessment like '%hypertension%'").map(&:id)
    # Find all the chat sessions that were used for the soap notes
    hyper_sessions = ChatSession.where(["soap_draft_id in (?)",hyper_ids])
    # Grab the patient (second person attribute)
    hyper_people = hyper_sessions.map(&:person_2)
    hyper_people.each do |person|
        id = person.id

        # Only add the person once 
        if !id_arr.include? id
            id_arr.push(id)
        end
    end

    # Grab all soap notes that mention blood pressure in the subjective, objective, or the assessment
    blood_ids = SoapDraft.where("subjective like '%blood pressure%' or objective like '%blood pressure' or assessment like '%blood pressure'").map(&:id)
    blood_sessions = ChatSession.where(["soap_draft_id in (?)", blood_ids])
    blood_people = blood_sessions.map(&:person_2)
    blood_people.each do |person|
        id = person.id

        # Only add the person once 
        if !id_arr.include? id
            id_arr.push(id)
        end
    end

    # Print out to csv
    id_arr.each do |id|
        csv << [id]
    end

end
