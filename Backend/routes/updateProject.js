const projects = require('../project-storage.js');
module.exports = {
    name: "updateProject",
    method:'POST',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            let project_id = body.id;
            if(projects.getItem(project_id)!=null){
                projects.setItem(body.id,body);
                out_obj="Project has been updated!"

            }else{
                out_obj="Project does not exists."
            }
            resolve(out_obj);            
        });
    }
}