const users = require('../user-storage.js');
module.exports = {
    name: "getLogin",
    method:'GET',
    execute(params){
        return new Promise(resolve=>{
            let out_obj = {};
            let email = params.email;
            let password = params.password;
            out_obj = users.getItem(email);
            if(out_obj != null){
                if(out_obj.Password === password){
                    const { ["Password"]: _, ...new_obj } = out_obj;
                    out_obj = new_obj;
                }else{
                    out_obj = "Incorrect Username/Password"
                }
            }else{
                out_obj = "User does not exists";
            }
            resolve(out_obj);            
        });
    }
}