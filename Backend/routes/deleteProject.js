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

                // Clean out the project from interested users' array
                projectData["Interested Users"].forEach((user) => {
                    const userData = users.getItem(user);
                    userData.ProjectsInterested = userData.ProjectsInterested.filter((project) => {
                        return project !== body.id;
                    });
                    users.setItem(user, userData);
                });

                // Clean out project from creator's array
                const creator = users.getItem(projectData.AuthorEmail);
                creator.ProjectsCreated = creator.ProjectsCreated.filter((project) => {
                    return project !== body.id;
                });
                users.setItem(projectData.AuthorEmail, creator);

                // Delete project
                projects.deleteItem(body.id);

                // Send response
                outObj["response"] = "Project successfully deleted!";
                resolve(outObj);
            }
        });
    }
}