const fs = require('fs');
const routingtable = {};
let types = {
    "js":"text/javascript",
    "css":"text/css",
    "html":"text/html",
    "svg":"image/svg+xml"
}

module.exports = { 
    
sendFile(filename,res)
{
        let path = `./src/${filename}`
        let file = fs.createReadStream(path);
        file.on('data',(data)=>res.write(data));
        file.on('end',()=>res.end())
},
ImportSourceFiles() {
    fs.readdir('./src',(err,files)=>{
        for (const file of files) {
            let fileExt = file.substring(file.lastIndexOf('.')+1);
            let obj = {
                GET:(req,res)=>{
                res.writeHeader(200,{'Content-Type':types[fileExt]});
                sendFile(file,res);
                }
            }
            console.log(`Imported ${file}`);
            routingtable[file] = obj;
        }
    })
}

}

