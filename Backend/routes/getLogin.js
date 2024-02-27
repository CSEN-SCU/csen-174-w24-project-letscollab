const users = require('../user-storage.js');
const { v4: uuidv4 } = require('uuid'); 
module.exports = {
    name: "getLogin",
    method:'GET',
    execute(params,req){
        return new Promise((resolve,reject)=>{
            let out_obj = {};
            let email = params.email;
            let password = params.password;
            let userObject = users.getItem(email);
            if(userObject != null){
                if(userObject.Password === password){
                    //const { ["Password"]: _, ...new_obj } = userObject;
                    out_obj = {...userObject};
                    req.session.Email = userObject.Email;
                    out_obj["response"] = "Login Success";
                }else{
                    out_obj["response"] = "Incorrect Username/Password"
                }
            }else{
                out_obj["response"] = "User does not exists";
            }
            resolve(out_obj);            
        });
    }
}