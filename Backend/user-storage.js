const fs = require("fs").promises;
//const log = require("../utils/log");

let data = {};
fs.readFile("./studentprofiles.json")
  .then((contents) => {
    if (contents) {
      data = JSON.parse(contents);
    }
  })
  .catch((err) => {
    if (err.code === "ENOENT") {
      fs.writeFile("./studentprofiles.json", JSON.stringify({}));
    }
  });

module.exports = {
  getKeys: ()=>{
    return Object.keys(data);
  },
  getData: ()=>{
    let allData = data;
    return allData;
  },
  getItem: (key) => {
    let dataItem = data[key] || null;
    return dataItem;
  },
  setItem: (key, value) => {
    data[key] = value;
    fs.writeFile("./studentprofiles.json", JSON.stringify(data));
  },
};