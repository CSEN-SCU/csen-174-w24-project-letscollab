const oAuth2 = require("../oAuth2")
module.exports = {
    name: "getGoogleAuthURL",
    method:'GET',
    execute(body){
        let out_obj = {};
        return new Promise(async resolve=>{
            const url = await oAuth2.generateAuthorizationUrl();
            out_obj["url"] = url;
            resolve(out_obj);            
        });
    }
}