const fs = require("fs").promises;
//const log = require("../utils/log");

let data = {};
fs.readFile("./projects.json")
  .then((contents) => {
    if (contents) {
      data = JSON.parse(contents);
      fs.writeFile("./projects.json", JSON.stringify(data,0,4));
    }
  })
  .catch((err) => {
    if (err.code === "ENOENT") {
      fs.writeFile("./projects.json", JSON.stringify({}));
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
    fs.writeFile("./projects.json", JSON.stringify(data,0,4));
  },
  deleteItem: (key) => {
    delete data[key];
    fs.writeFile("./projects.json", JSON.stringify(data, 0, 4));
  }
};