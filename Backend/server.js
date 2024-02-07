const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const {ImportSourceFiles,sendFile} = require("./importCommands")

const fs = require("fs");
let Commands = new Map();
function ImportCommands() {
    const commandFiles = fs.readdirSync('./routes').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./routes/${file}`);
        Commands.set(command.name, command);
        console.log(`Imported ${file}...`)
    }
}
ImportCommands(); //Imports all GET and POST routes
ImportSourceFiles(); //Imports all the html files to serve them when requested
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/v1/:get',async(req,res)=>{
    const command = Commands.get(req.params.get);
    let resObj = await command.execute(req.query);
    res.send(resObj)
})

app.post('/v1/:post',async(req,res)=>{
    console.log(req.body);
    const command = Commands.get(req.params.post);
    let resObj = await command.execute(req.body);
    res.send(resObj)
})

app.get("/:page",(req,res)=>{
    sendFile(req.params.page,res);
})

app.listen(port,()=>{
    console.log(`Now listening on port ${port}`);
})
