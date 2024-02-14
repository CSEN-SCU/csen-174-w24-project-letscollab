const projects = require('../project-storage.js');
module.exports = {
    name: "getAllProjects",
    method:'GET',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            out_obj = projects.getData();    
            resolve(out_obj);            
        });
    }
}