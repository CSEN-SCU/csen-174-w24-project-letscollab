const users = require('../user-storage.js');
module.exports = {
    name: "updateUser",
    method:'POST',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            let email = body.Email;
            let updatedUser = body;
            let userObject = users.getItem(email);
            if(userObject !=null){
                for (let key in updatedUser) {
                    if (updatedUser.hasOwnProperty(key)) {
                        userObject[key] = updatedUser[key];
                    }
                }
                users.setItem(email,userObject);
                let userObj = users.getItem(email);
                out_obj = {...userObj};
                out_obj["response"]= "Updated user!";
            }else{
                out_obj["response"]= "User does not exists!";
            }
            resolve(out_obj);            
        });
    }
}