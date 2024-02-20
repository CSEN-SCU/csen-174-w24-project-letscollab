const skills = require('../skill-storage.js');
module.exports = {
    name: "getSkills",
    method: "GET",
    execute(params) {
        let outObj = {};
        return new Promise(resolve => {
            outObj = skills.getData();
            outObj["response"] = "Retrieved skills";
            resolve(outObj);
        })
    }
}