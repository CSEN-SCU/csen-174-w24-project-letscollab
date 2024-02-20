const users = require('../user-storage.js');
module.exports = {
    name: "getInterestedProjects",
    method:'GET',
    execute(params,req){
        let out_obj = {};
        return new Promise(resolve=>{
            let id = req.session.Email || params.id;
            let userObject = users.getItem(id);
            if(userObject != null){
                out_obj["ProjectsInterested"] = userObject["ProjectsInterested"];
                out_obj["response"] = "Got Interested Projects";
            }else{
                out_obj["response"] = "User does not exists";
            }
            resolve(out_obj);            
        });
    }
}