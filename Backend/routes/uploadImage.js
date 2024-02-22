const users = require('../user-storage.js');
const fs = require('fs');
module.exports = {
    name: "upload",
    method:'POST',
    execute(body){
        let out_obj = {};
        console.log(body);
        // fs.writeFile('./obj.jpg',body.file,err=>{
        //     if(err){
        //         out_obj["response"] = "rip";
        //     }
        //     else{
        //         console.log("wrote file successfulyl");
        //     }
        //     resolve(out_obj);
        
        // })
    }
}