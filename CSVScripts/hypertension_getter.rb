require 'csv'

# Number of people to grab
people_limit = 1000

# returns people that have followed high blood pressure or hypertension or have had a consult regarding high blood pressure
CSV.open("./hypertension.csv","wb") do |csv|
    csv << ["First Name", "Last Name", "Gender", "Email", "State", "City", "Birthday", "Consult"]

    
    people_arr = []


    # This query grabs all users who have followed the condition Hypertension/high blood pressure
    ids = [111086592, 111057229]

    Follow.where(["followable_id in (?)", ids]).limit(people_limit).each do |followable|
        person = followable.follower
        name = person.name
        gender = person.gender
        last_name = person.last_name
        email = person.email
        state = person.state
        city = person.city
        birthday = person.birthday
        id = person.id

        # Only add the person once 
        if !people_arr.any? {|p| p["email"] == email}
            person_obj = {"name" => name, "last_name" => last_name, "id"=>id, "gender" => gender, "email" => email, "state" => state, "city" => city, "birthday" => birthday, "consult" => false}
            people_arr.push(person_obj)
        end
    end
 
    # Grab all soap notes that mention hypertension in the subjective, objective, or the assessment
    hyper_ids = SoapDraft.where("subjective like '%hypertension%' or objective like '%hypertension%' or assessment like '%hypertension%'").map(&:id)
    # Find all the chat sessions that were used for the soap notes
    hyper_sessions = ChatSession.where(["soap_draft_id in (?)",hyper_ids])
    # Grab the patient (second person attribute)
    hyper_people = hyper_sessions.map(&:person_2)
    hyper_people.each do |person|
        name = person.name
        gender = person.gender
        last_name = person.last_name
        email = person.email
        state = person.state
        city = person.city
        birthday = person.birthday
        id = person.id

        if people_arr.any? {|p| p["email"] == email}
            existing_person = people_arr.find {|cons| cons["email"] == email}
            existing_person["consult"] = true
        else
            person_obj = {"name" => name, "last_name" => last_name, "id"=>id, "gender" => gender, "email" => email, "state" => state, "city" => city, "birthday" => birthday, "consult" => true}
            people_arr.push(person_obj)
        end
    end

    # Grab all soap notes that mention blood pressure in the subjective, objective, or the assessment
    blood_ids = SoapDraft.where("subjective like '%blood pressure%' or objective like '%blood pressure' or assessment like '%blood pressure'").map(&:id)
    blood_sessions = ChatSession.where(["soap_draft_id in (?)", blood_ids])
    blood_people = blood_sessions.map(&:person_2)
    blood_people.each do |person|
        name = person.name
        gender = person.gender
        last_name = person.last_name
        email = person.email
        state = person.state
        city = person.city
        birthday = person.birthday
        id = person.id
        
        if people_arr.any? {|p| p["email"] == email}
            existing_person = people_arr.find {|cons| cons["email"] == email}
            existing_person["consult"] = true
        else
            person_obj = {"name" => name, "last_name" => last_name, "id" => id, "gender" => gender, "email" => email, "state" => state, "city" => city, "birthday" => birthday, "consult" => true}
            people_arr.push(person_obj)
        end
    end

    people_arr.each do |person|
        csv << [person["name"],person["last_name"],person["id"],person["gender"],person["email"],person["state"],person["city"],person["birthday"], person["consult"]]
    end

end
