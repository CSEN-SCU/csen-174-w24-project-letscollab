const users = require('../user-storage.js');
module.exports = {
    name: "getUser",
    method:'GET',
    execute(params){
        let out_obj = {};
        return new Promise(resolve=>{
            out_obj = users.getItem(params.id);
            if(out_obj != null){
                const { ["Password"]: _, ...new_obj } = out_obj;
                out_obj = new_obj;
            }else{
                out_obj = "User does not exists";
            }
            resolve(out_obj);            
        });
    }
}