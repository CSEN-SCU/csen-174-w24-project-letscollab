const fs = require("fs").promises;
const yaml = require('yaml-config')
const config = yaml.readConfig("./config/config.yml",'default');
let filePath = config.debug ? "./projectstest.json" : './projects.json';
console.log(`Using ${filePath} for student profiles because debug is ${config.debug}`);

let data = {};
fs.readFile(filePath)
  .then((contents) => {
    if (contents) {
      data = JSON.parse(contents);
      fs.writeFile(filePath, JSON.stringify(data,0,4));
    }
  })
  .catch((err) => {
    if (err.code === "ENOENT") {
      fs.writeFile(filePath, JSON.stringify({}));
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
    fs.writeFile(filePath, JSON.stringify(data,0,4));
  },
  deleteItem: (key) => {
    delete data[key];
    fs.writeFile(filePath, JSON.stringify(data, 0, 4));
  }
};