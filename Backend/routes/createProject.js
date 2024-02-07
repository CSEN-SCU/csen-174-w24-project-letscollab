const projects = require('../project-storage.js');
const { uuid } = require('uuidv4');
module.exports = {
    name: "createProject",
    method:'POST',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            projects.setItem(uuid(),body);
            resolve(out_obj);            
        });
    }
}