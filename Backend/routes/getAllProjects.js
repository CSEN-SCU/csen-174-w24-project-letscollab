const projects = require('../project-storage.js');
module.exports = {
    name: "getAllProjects",
    method:'GET',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            let projectData = projects.getData();  
            if(projectData!=null){
                out_obj = {...projectData};
                out_obj["response"] = "Got all projects"
            }else{
                out_obj["response"] = "Could not fetch projects"
            }
            resolve(out_obj);            
        });
    }
}