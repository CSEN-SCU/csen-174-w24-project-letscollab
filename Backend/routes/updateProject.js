const projects = require('../project-storage.js');
module.exports = {
    name: "updateProject",
    method:'POST',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            let project_id = body.id;
            let updatedProject = body;
            let projectObject = projects.getItem(project_id);
            if(projectObject!=null){
                for (let key in updatedProject) {
                    if (updatedProject.hasOwnProperty(key)) {
                        projectObject[key] = updatedProject[key];
                    }
                }
                projects.setItem(project_id,projectObject);
                let projObj = projects.getItem(project_id);
                let out_obj = {...projObj};
                out_obj["response"]="Project has been updated!"

            }else{
                out_obj["response"]="Project does not exists."
            }
            resolve(out_obj);            
        });
    }
}