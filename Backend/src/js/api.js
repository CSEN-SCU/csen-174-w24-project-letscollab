class LetsCollab {
    constructor() {
        this.url = "/v1/";
    }

    /**
     * @param {string} email User email
     * @param {string} password User password
     */
    getLogin(email, password) {
        const params = `getLogin?email=${email}&password=${password}`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

    getAllProjects() {
        const params = `getAllProjects`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

    getAllUsers() {
        const params = `getAllUsers`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getProject(id) {
        const params = `getProject?id=${id}`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getUser(email) {
        const params = `getUser?id=${email}`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getInterestedProjects(email) {//email is optional, if you logged in in the same session, a cookie will be used to assume the email
        const params = `getInterestedProjects${email!=""?"?id="+email:""}`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getInterestedUsers(projectID) {
        const params = `getInterestedUsers?id=${projectID}`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getProjectsCreated(email) {//email is optional, if you logged in in the same session, a cookie will be used to assume the email
        const params = `getProjectsCreated${email!=""?"?id="+email:""}`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getSkills() {
        const params = `getSkills`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    createSkill(skillName, skillType){
        const params = `createSkill`;
        let body = {
            "name":skillName,
            "type":skillType
        }
        return new Promise((resolve, reject) => {
            this.apiRequest(params,body,"POST").then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    createProject(newProjectBody){
        const params = `createProject`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params,newProjectBody,"POST").then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    createUser(newUserObject){
        const params = `createUser`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params,newUserObject,"POST").then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    updateUser(userObject){
        const params = `updateUser`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params,userObject,"POST").then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    updateProject(projectBody){
        const params = `updateProject`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params,projectBody,"POST").then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    setProjectInterest(projectID, isInterested){ 
        let body = {
            "id":projectID,
            "setInterestTo":isInterested
        }
        const params = `setProjectInterest`;
        return new Promise((resolve, reject) => {
            this.apiRequest(params,body,"POST").then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
    

    /**
     * Performs an API request using jQuery AJAX.
     * @param {string} params URL route
     * @param {*} body Content of the body.
     * @param {string} method HTTP Method. Default is 'GET'
     */
    async apiRequest(params, body, method='GET') {
        return await new Promise((resolve, reject) => {
            $.ajax({
                url: this.url + params,
                type: method,
                contentType: 'application/json',
                data: method === 'GET' ? undefined : JSON.stringify(body),
                success: function(data) {
                    resolve(data);
                },
                error: function(xhr, status, error) {
                    reject(error);
                }
            });
        });
    }
}

const API = new LetsCollab();
