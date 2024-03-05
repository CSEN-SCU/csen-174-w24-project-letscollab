const users = require('../user-storage.js');
module.exports = {
    name: "getAllUsers",
    method:'GET',
    execute(body){
        let out_obj = {};
        return new Promise(resolve=>{
            let userobj = users.getData();
            if(userobj!=null){
                let newobj = {...userobj};
                out_obj = Object.entries(newobj).reduce((parentObject, [key, value]) => {
                    const { Password, ...reducedUserObject } = value; 
                    parentObject[key] = reducedUserObject; 
                    return parentObject;
                  }, {});
                out_obj["response"]="Got Users";    
            }else{
                out_obj["response"]="Failed to fetch users";    
            }
            resolve(out_obj);            
        });
    }
}