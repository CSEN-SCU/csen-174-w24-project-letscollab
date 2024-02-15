const projects = require('../project-storage.js');
module.exports = {
    name: "getAllProjects",
    method:'GET',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            out_obj = projects.getData();  
            if(out_obj!=null){
                out_obj["response"] = "Got all projects"
            }else{
                out_obj["response"] = "Could not fetch projects"
            }
            resolve(out_obj);            
        });
    }
}