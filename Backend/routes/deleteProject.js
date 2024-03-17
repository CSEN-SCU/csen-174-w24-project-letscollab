const projects = require('../project-storage.js');
const users = require("../user-storage.js");

module.exports = {
    name: "deleteProject",
    method: "POST",
    execute(body, req) {
        let outObj = {};
        return new Promise(resolve => {
            if (!body) {
                outObj["response"] = "No project id supplied to the deleteProject request";
                resolve(outObj);
            } else {
                // Get data of project
                const projectData = projects.getItem(body.id);
                if(projectData!=null && projectData.AuthorEmail === req.session.Email){
                    // Clean out the project from interested users' array
                    projectData["Interested Users"].forEach((user) => {
                        const userData = users.getItem(user);
                        userData.ProjectsInterested = userData.ProjectsInterested.filter((project) => {
                            return project !== body.id;
                        });
                        users.setItem(user, userData);
                    });

                    // Clean out project from creator's array
                    const creator = users.getItem(req.session.Email);
                    creator.ProjectsCreated = creator.ProjectsCreated.filter((project) => {
                        return project !== body.id;
                    });
                    users.setItem(req.session.Email, creator);

                    // Delete project
                    projects.deleteItem(projectData.ID);

                    // Send response
                    if(projects.getItem(body.id) === null){
                        outObj = {"empty":true}
                        outObj["response"] = "Project successfully deleted!";
                        resolve(outObj);
                    }else{
                        outObj["response"] = "An error occured while deleting the project.";
                        resolve(outObj);
                    }
                }else{
                    outObj["response"] = "You are not the author of this project.";
                    resolve(outObj);
                }
            }
        });
    }
}