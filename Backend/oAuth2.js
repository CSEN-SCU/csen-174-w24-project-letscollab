// Import the necessary Google APIs and packages
const { google } = require('googleapis');
const users = require('./user-storage');
const yaml = require('yaml-config')
const config = yaml.readConfig("./config/config.yml",'default');

// Configuration for the OAuth2 client
const oauth2ClientConfig = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri
};

// Scopes define the level of access you are requesting from the user
const scopes = ['email', 'profile'];

// Initialize the OAuth2 client with the config
const oauth2Client = new google.auth.OAuth2(
    oauth2ClientConfig.clientId,
    oauth2ClientConfig.clientSecret,
    oauth2ClientConfig.redirectUri
);

// Function to generate the authorization URL
function generateAuthorizationUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline', // Will return a refresh token
        scope: scopes,
        include_granted_scopes: true
    });
}

// Function to get the OAuth2 tokens
async function getTokens(code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
}

// Function to get user information
async function getUserInfo() {
    let oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
    });
    return new Promise((resolve, reject) => {
        oauth2.userinfo.get((err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response.data);
            }
        });
    });
}

async function createUserFromOAuth2(googleProfile){
    console.log("Received Google Profile Data: ");
    console.log(googleProfile);
    return new Promise((resolve)=>{
        let email = googleProfile.email;
        let userObject = users.getItem(email);
        if(userObject==null){
            let newUserObj = {};
            newUserObj["FirstName"] = googleProfile.name.split(' ')[0]
            newUserObj["LastName"] = googleProfile.name.split(' ')[1]
            newUserObj["Email"] = googleProfile.email;
            newUserObj["GoogleID"] = googleProfile.id;
            newUserObj["Password"] = "";
            newUserObj["Year"] = "Freshman";
            newUserObj["Description"] = "";
            newUserObj["Skills"] = [];
            newUserObj["ProjectsCreated"] = [];
            newUserObj["ProjectsInterested"] = [];
            users.setItem(email,newUserObj);
            let newUser = users.getItem(email);
            if(newUser!=null){
                out_obj = {...newUser};
                out_obj["response"]= "Created user!";
            }else{
                out_obj["response"]= "Error creating user!";
            }
        }else{
            out_obj = {...userObject};
            out_obj["response"]= "This user is already created";
        }    
        resolve(out_obj);   
 
    });
}

// Export the functions and variables that are necessary for other modules
module.exports = {
    generateAuthorizationUrl,
    getTokens,
    getUserInfo,
    createUserFromOAuth2
};
