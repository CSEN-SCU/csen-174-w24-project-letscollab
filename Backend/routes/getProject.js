const projects = require('../project-storage.js');
module.exports = {
    name: "getProject",
    method:'GET',
    execute(params){
        let out_obj = {};
        return new Promise(resolve=>{
            out_obj = projects.getItem(params.id);    
            if(out_obj == null){
                out_obj = "Project does not exist";
            }else{
                delete out_obj["Password"];    
            }
            resolve(out_obj);            
        });
    }
}