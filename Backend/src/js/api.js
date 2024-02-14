class LetsCollab {
    constructor() {
        this.url = "http://localhost:8080/v1/";
    }

    /**
     * @param {string} params URL route 
     * @param {*} body Content of body.
     * @param {string} method HTTP Method. Default is 'GET'
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

    async apiRequest(params, body, method) {
        return await new Promise((resolve, reject) => {
            const requestOptions = {
                method: method ? method : 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body ? JSON.stringify(body) : undefined
            };

            fetch(this.url + params, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => resolve(data.data))
                .catch(error => reject(error));
        });
    }
}

const API = new LetsCollab();