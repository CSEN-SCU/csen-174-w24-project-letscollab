const fs = require("fs").promises;
//const log = require("../utils/log");

let data = {};
fs.readFile("./projects.json")
  .then((contents) => {
    if (contents) {
      data = JSON.parse(contents);
    }
  })
  .catch((err) => {
    if (err.code === "ENOENT") {
      //log.warn("No storage.json file, creating.");
      fs.writeFile("./storage.json", JSON.stringify({}));
    }
  });

module.exports = {
  getKeys: ()=>{
    return Object.keys(data);
  },
  getItem: (key) => {
    return data[key] || null;
  },
  setItem: (key, value) => {
    data[key] = value;
    fs.writeFile("./storage.json", JSON.stringify(data));
  },
};
