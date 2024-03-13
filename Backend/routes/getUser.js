const users = require('../user-storage.js');
module.exports = {
    name: "getUser",
    method:'GET',
    execute(params){
        let out_obj = {};
        return new Promise(resolve=>{
            let userObject = users.getItem(params.id);
            if(userObject != null){
                const { ["Password"]: _, ...new_obj } = userObject;
                out_obj = new_obj;
                out_obj["response"] = "Got User";
            }else{
                out_obj["response"] = "User does not exists";
            }
            resolve(out_obj);            
        });
    }
}