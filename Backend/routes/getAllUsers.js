const users = require('../user-storage.js');
module.exports = {
    name: "getAllUsers",
    method:'GET',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            out_obj = users.getData();    
            resolve(out_obj);            
        });
    }
}