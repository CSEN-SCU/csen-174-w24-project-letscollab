//DEPRECATED

// const fs = require('fs');
// const routingtable = {};
// const pathModule = require('path');
// let types = {
//     "js":"text/javascript",
//     "css":"text/css",
//     "html":"text/html",
//     "svg":"image/svg+xml",
//     "jpg":"image/jpeg"
// }
// module.exports = { 
// sendFile(filename,res)
// {
//         let path = pathModule.join(__dirname+"/src", filename);
//         if(!fs.existsSync(path)){
//             return res.sendStatus(404);
//         }
//         let fileExt = filename.substring(filename.lastIndexOf('.')+1);
//         res.writeHeader(200,{'Content-Type':types[fileExt]});
//         let file = fs.createReadStream(path);
//         file.on('data',(data)=>res.write(data));
//         file.on('end',()=>res.end())
// },
// ImportSourceFiles() {
//     fs.readdir('./src',(err,files)=>{
//         for (const file of files) {
//             let fileExt = file.substring(file.lastIndexOf('.')+1);
//             let obj = {
//                 GET:(req,res)=>{
//                 res.writeHeader(200,{'Content-Type':types[fileExt]});
//                 sendFile(file,res);
//                 }
//             }
//             console.log(`Imported ${file}`);
//             routingtable[file] = obj;
//         }
//     })
// }
// }