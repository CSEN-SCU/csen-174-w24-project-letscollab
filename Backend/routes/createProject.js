const projects = require('../project-storage.js');
const { uuid } = require('uuidv4');
function validateProject(project) {
    // Check if the Name field exists and is not empty
    const hasName = project.hasOwnProperty('Name') && project.Name.trim() !== '';
    // Check if the Description field exists and is not empty
    const hasDescription = project.hasOwnProperty('Description') && project.Description.trim() !== '';
    
    // Return true if all conditions are met, false otherwise
    return hasName && hasDescription;
}
const toTimestampString = () => {
    const dt = new Date().getTime();
    return Math.floor(dt / 1000);
}
module.exports = {
    name: "createProject",
    method:'POST',
    execute(body,req){
        let out_obj = {};
        return new Promise(resolve=>{
            if(!validateProject(body)){
                out_obj["response"] = "Invalid Project Format";
                resolve(out_obj);
            }
            let project_id = uuid();
            body["ID"] = project_id;
            body["Interested Users"] = [];
            body["AuthorEmail"] = req.session.Email;
            body["CreatedAt"] = toTimestampString();
            projects.setItem(project_id,body);
            let projectObject = projects.getData(project_id);
            if(projectObject!=null){
                out_obj = projectObject;
                out_obj["response"] = "Created Project!";
            }else{
                out_obj["response"] = "Error Creating Project!";
            }
            resolve(out_obj);            
        });
    }
}