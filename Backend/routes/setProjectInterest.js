const projects = require('../project-storage.js');
const users = require('../user-storage.js');

module.exports = {
    name: "setProjectInterest",
    method:'POST',
    execute(body,req){
        let out_obj = {};
        return new Promise(resolve=>{
            let projectID = body.id;
            let interested = body.setInterestTo; //boolean value passed from client, TRUE = add project interest, FALSE = remove it
            let email = req.session.Email || body.Email;
            let projectObject = projects.getItem(projectID);
            let userObject = users.getItem(email);
            if(userObject==null){
                out_obj["response"] = "User does not exist";
            }else{
                if(projectObject == null){
                    out_obj["response"] = "Project does not exist";
                }else{
                    if(interested){//true if user is interested in project
                        if(projectObject["Interested Users"].includes(email)){
                            out_obj["response"] = "You are already interested in this project!";    
                        }else{//else if user is interested in project but does not exist in array
                            projectObject["Interested Users"].push(email);
                            projects.setItem(projectID,projectObject);
                            if(!userObject["ProjectsInterested"].includes(projectID)){
                                userObject["ProjectsInterested"].push(projectID)
                                users.setItem(email,userObject);
                            }
                            out_obj["ProjectsInterested"] = userObject["ProjectsInterested"];
                            out_obj["response"] = "You are now interested in this project!";    
                        }
                    }else{//if not interested in the project anymore
                        if(projectObject["Interested Users"].includes(email)){
                            const index = projectObject["Interested Users"].indexOf(email);
                            if (index > -1) {
                                projectObject["Interested Users"].splice(index, 1); // Removes the element at the found index
                                projects.setItem(projectID,projectObject);
                                const userIndex = userObject["ProjectsInterested"].indexOf(projectID);
                                if (userIndex > -1) {
                                    userObject["ProjectsInterested"].splice(userIndex, 1); // Removes the element at the found index
                                    users.setItem(email,userObject);
                                }
                                out_obj["ProjectsInterested"] = userObject["ProjectsInterested"];
                                out_obj["response"] = "You are no longer interested in this project."; 
                            }
                        }else{
                            out_obj["response"] = "You are not interested in this project";  
                        }               
                    }
                }
             }
            resolve(out_obj);            
        });
    }
}