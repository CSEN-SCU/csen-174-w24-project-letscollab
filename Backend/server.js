const express = require("express");
const app = express();
const port = 8080;
const projects = require('./file-storage');
const cors = require("cors");
const init = require("./importCommands")
init.ImportCommands();

app.get('/projects',(req,res)=>{
    if(req.query.id == null) return res.send(JSON.stringify(projects.getKeys()));
    let data = projects.getItem(req.query.id);
    res.send(JSON.stringify(data));
});

app.get('/users/:id',(req,res)=>{
    res.send(JSON.stringify(projects[req.params.id]))
})

app.get("/:page",(req,res)=>{
    init.sendFile(req.params.page,res);
})
app.use(cors());
app.listen(port,()=>{
    console.log(`Now listening on port ${port}`);
})
