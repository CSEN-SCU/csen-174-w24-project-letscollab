const fs = require("fs").promises;

let data = {};
const updateSkillList = () => {
    fs.readFile("./skills.json")
        .then((contents) => {
            if (contents) {
                data = JSON.parse(contents);
                fs.writeFile("./skills.json", JSON.stringify(data, null, 4));
            }
        })
        .catch((err) => {
            if (err.code === "ENOENT") {
                fs.writeFile("./skills.json", JSON.stringify({}));
            }
        });
}

updateSkillList();

module.exports = {
    getKeys: () => {
        return Object.keys(data);
    },
    getData: () => {
        updateSkillList();
        let allData = data;
        return allData;
    },
    getItem: (key) => {
        let dataItem = data[key] || null;
        return dataItem;
    },
    addSkill: (skill) => {
        data["skillList"].append(skill);
        fs.writeFile("./projects.json", JSON.stringify(data,0,4));
    },
}