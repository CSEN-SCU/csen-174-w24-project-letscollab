const projects = require('../project-storage.js');
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

  async function sendEmail(project, receivers, AuthorEmail) {
    // send mail with defined transport object
    let receivers_ = receivers
    receivers_.push(AuthorEmail)
    return new Promise(async(resolve,reject)=>{
        transporter.sendMail({
          from: `"LetsCollab" <${config.gmailUsername}>`, // sender address
          to: receivers_, // list of receivers
          subject: `LetsCollab: ${project.Name}`,
          text:`You have received an email from ${project.Name}! Email your project author ${AuthorEmail}`
          
        }).then((info)=>{
            resolve({status:true,id:info.messageId,receivers:info.accepted});
        }).catch((err)=>{
            console.log(err);
            resolve({status:false,error:err})
        })
    })
    
  
  }

module.exports = {
    name: "notifyInterestedUsers",
    method:'POST',
    execute(body,req){
        return new Promise(async resolve=>{
            let out_obj = {};
            let project_id = body.id;
            let authorEmail = req.session.Email;
            let projectObject = projects.getItem(project_id);
            if(projectObject!=null){
                if(projectObject.AuthorEmail===authorEmail){
                    let interestedUsers = projectObject["Interested Users"];
                    let res = await sendEmail(projectObject,interestedUsers,authorEmail)
                    if(res.status){ 
                        out_obj["info"]=res;
                        out_obj["response"]="Email sent to interestedUsers";
                    }else{
                        out_obj["response"] = "Error sending email"
                    }
                }else{
                    out_obj["response"]="You do not have permission to do this!"
                }
            }else{
                out_obj["response"]="Project does not exists."
            }
            resolve(out_obj);            
        });
    }
}