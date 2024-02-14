const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const path = require('path');
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
ImportCommands(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/v1/:get',async(req,res)=>{
    const command = Commands.get(req.params.get);
    let resObj = await command.execute(req.query);
    res.status(200).send({"data":resObj,"status":typeof resObj == "object"})
})

app.post('/v1/:post',async(req,res)=>{
    console.log(req.body);
    const command = Commands.get(req.params.post);
    let resObj = await command.execute(req.body);
    res.status(200).send({"data":resObj,"status":typeof resObj == "object"})
})
app.use(express.static(path.join(__dirname, 'src')));

app.listen(port,()=>{
    
    console.log(`Now listening on port ${port}`);
})
