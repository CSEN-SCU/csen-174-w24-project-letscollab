const fs = require("fs").promises;

let data = {};
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

module.exports = {
    getKeys: () => {
        return Object.keys(data);
    },
    getData: () => {
        let allData = data;
        return allData;
    },
    getItem: (key) => {
        let dataItem = data[key] || null;
        return dataItem;
    }
}