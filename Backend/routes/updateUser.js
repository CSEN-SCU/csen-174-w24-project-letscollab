const users = require('../user-storage.js');
module.exports = {
    name: "updateUser",
    method:'POST',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            let email = body.Email;
            let data = users.getData();
            if(data[email]==null){
                users.setItem(email,body);
                out_obj= "Added user!";

            }else{
                out_obj= "User already exists!";
            }
            resolve(out_obj);            
        });
    }
}