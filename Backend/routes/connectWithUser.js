const users = require('../user-storage.js');
const nodemailer = require('nodemailer');
const yaml = require('yaml-config')
const config = yaml.readConfig("./config/config.yml",'default');
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.gmailUsername,
      pass: config.gmailpassword,
    },
  });

  async function sendEmail(from, to) {
    return new Promise(async(resolve,reject)=>{
        transporter.sendMail({
          from: `"LetsCollab" <${config.gmailUsername}>`, // sender address
          to: [from.Email,to.Email], // list of receivers
          subject: `LetsCollab: ${from.FirstName} wants to connect with you!`,
          text:`You have are now in an email thread with ${from.FirstName} ${from.LastName}`
          
        }).then((info)=>{
            resolve({status:true,id:info.messageId,receivers:info.accepted});
        }).catch((err)=>{
            console.log(err);
            resolve({status:false,error:err})
        })
    })
    
  
  }

  module.exports = {
    name: "connectWithUser",
    method:'POST',
    execute(body,req){
        return new Promise(async resolve=>{
            let out_obj = {};
            let otherUser = body.Email;
            let authorEmail = req.session.Email;
            let otherUserObj = users.getItem(otherUser);
            let authorObj = users.getItem(authorEmail);
            if(otherUserObj==null || authorObj==null){
                out_obj["response"]="User does not exists."
                resolve(out_obj);
            }else{
                if(authorEmail!=otherUser){
                    
                    let res = await sendEmail(authorObj,otherUserObj);
                    if(res.status){ 
                        out_obj["info"]=res;
                        out_obj["response"]=`Email sent to ${otherUserObj.Email}!`;
                    }else{
                        out_obj["response"] = "Error sending email"
                    }
                }else{
                    out_obj["response"]="You cannot send email to yourself!"
                }
                resolve(out_obj);     
            }       
        });
    }
}