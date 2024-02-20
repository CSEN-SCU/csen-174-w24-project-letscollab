const projects = require('../project-storage.js');
module.exports = {
    name: "getInterestedUsers", //gets interested users by project
    method:'GET',
    execute(params){
        let out_obj = {};
        return new Promise(resolve=>{
            let projectObject = projects.getItem(params.id);    
            if(projectObject == null){
                out_obj["response"] = "Project does not exist";
            }else{
                out_obj["InterestedUsers"] = projectObject["Interested Users"];
                out_obj["response"] = "Successfully fetched interested users";    
            }
            resolve(out_obj);            
        });
    }
}