const skills = require('../skill-storage.js');
module.exports = {
    name: "createSkill",
    method:'POST',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            let skillName = body.name;
            let skillType = body.type;
            if(skillType==null || skillType == ""){skillType="cs"}
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
                        out_obj["response"] = "Skill added!";
                    }else{
                        out_obj["response"] = "Error adding skill";
                    }
                }else{
                    out_obj["response"] = "Skill already exists";
                }
            }else{
                out_obj["response"] = "Skilltype or skillname is null";
            }
            resolve(out_obj);   
     
        });
    }
}