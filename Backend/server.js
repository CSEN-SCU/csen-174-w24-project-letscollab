const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const projects = require('./file-storage');
const cors = require("cors");

app.get('/projects',(req,res)=>{
    if(req.query.id == null){
        res.send(JSON.stringify(projects.getKeys()));
        return;
    }
    let data = projects.getItem(req.query.id);
    console.log(data);
    res.send(JSON.stringify(data));
});

app.get('/users/:id',(req,res)=>{
    res.send(JSON.stringify(projects[req.params.id]))
})


app.get("/",(req,res)=>{
    res.send("hello my friend");
})
app.use(express.static(path.join(__dirname, 'src')));
app.use(cors());
app.listen(port,()=>{
    console.log(`Now listening on port ${port}`);
})
