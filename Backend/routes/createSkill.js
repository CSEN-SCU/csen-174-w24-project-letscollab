const skills = require('../skill-storage.js');
const users = require('../user-storage.js')
module.exports = {
    name: "createSkill",
    method:'POST',
    execute(body,req){
        let out_obj = {};
        return new Promise(resolve=>{
            let email = req.session.Email;
            let skillName = body.name;
            let skillType = body.type;
            let userobj = users.getItem(email);

            if(skillType==null || skillType == ""){skillType="cs"}
            if(userobj!=null){
            if(skillName!=null && skillType !=null){
                let skillObject = skills.getItem(skillName);
                if(skillObject==null){
                    let skill = {
                        "skillName":skillName,
                        "skillType":skillType
                    }
                    skills.setItem(skillName,skill);
                    let newSkillObject = skills.getItem(skillName);
                    if(newSkillObject!=null){
                        out_obj["Skill"] = newSkillObject
                    
                        let userSkills = userobj["Skills"];
                        if(userSkills.includes(skillName)){
                            out_obj["response"] = "User already has skill";
                        }else{
                            userobj["Skills"].push(skillName);
                            users.setItem(email,userobj);
                            out_obj["response"] = "Skill created and added to User!";
                        }
                    }else{
                        out_obj["response"] = "Error adding skill";
                    }
                }else{
                    out_obj["response"] = "Skill already exists";
                }
            }else{
                out_obj["response"] = "Skilltype or skillname is null";
            }
        }else{
            out_obj["response"] = "User does not exists. Cannot make request."
        }
            resolve(out_obj);   
     
        });
    }
}