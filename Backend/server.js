const express = require("express");
const session = require('express-session');
const app = express();
const cors = require("cors");
const path = require('path');
const fs = require("fs");
app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

const port = 8080;

let Commands = new Map();
function isEmpty(obj) {
    if(obj==null)return true;
    return Object.keys(obj).length === 0;
}

function ImportCommands() {
    const commandFiles = fs.readdirSync('./routes').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./routes/${file}`);
        Commands.set(command.name, command);
        console.log(`Imported ${file}...`)
    }
}

function validateToken(req, res, next) {
    if(req.params.page.replace(/\.html$/,'') != "login" && req.session.Email == null){
        res.redirect('/login');
    }else{
        next();
    }
}

  
ImportCommands(); 
app.use(express.static(path.join(__dirname, 'src')));

app.get('/v1/:get',async(req,res)=>{
    const command = Commands.get(req.params.get);
    let resObj = await command.execute(req.query,req);
    let response = resObj["response"];
    const { ["response"]: _, ...out_obj } = resObj;
    res.status(200).send({
        "data":out_obj,
        "status":!isEmpty(out_obj),
        "response":response
    })
})

app.post('/v1/:post',async(req,res)=>{
    const command = Commands.get(req.params.post);
    let resObj = await command.execute(req.body,req);
    let response = resObj["response"];
    const { ["response"]: _, ...out_obj } = resObj;
    res.status(200).send({
        "data":out_obj,
        "status":!isEmpty(out_obj),
        "response":response
    })
})

app.get("/:page",validateToken,(req,res)=>{
    let page = req.params.page;
    if(page.includes(".html")){
        res.redirect(page.replace(/\.html$/, ''))
    }else{
        res.sendFile(path.join(__dirname, `/src/html/${req.params.page}${page.includes(".html")?"":".html"}`));
    }
});

app.listen(port,()=>{
    
    console.log(`Now listening on port ${port}`);
})