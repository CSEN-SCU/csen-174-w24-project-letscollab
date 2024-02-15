const users = require('../user-storage.js');
module.exports = {
    name: "getAllUsers",
    method:'GET',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            out_obj = users.getData();
            if(out_obj==null){
                out_obj["response"]="failed";    
            }else{
                out_obj["response"]="success";    
            }
            resolve(out_obj);            
        });
    }
}