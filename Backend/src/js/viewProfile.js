

async function setProfileDetails(userobj){
$("#profileHeader").html(`${userobj.FirstName}'s Profile`);
$("#usericon p").html(`${userobj.FirstName[0].toUpperCase()}${userobj.LastName[0].toUpperCase()}`);
$('#Name').val(`${userobj.FirstName} ${userobj.LastName}`);
$('#lastname').val(userobj.LastName);
//$('#password').val(localStorage.getItem("Password"));
$('#email').val(userobj.Email);
$('#year').val(userobj.Year);
$('#description').val(userobj.Description)

const container = $(".skills");
userobj.Skills.forEach((skill) => {
    createProfileSkill(container, {"skillName":skill,"skillType":""},[]);
    
}); 

}

function setLoader(){
    $('#response').html("");
    $('#response').addClass("loader");

}
async function setResponse(text, color){
    await delay(250);
    $('#response').removeClass("loader");
    $('#response').html(`${text}`).css("color",color);
    setTimeout(()=>{
        $('#response').html("");
    },800)
}

async function getRelatedProjects(projects,elem){
    try {
        const results = await Promise.all(projects.map(async (id) => {
            try {
                const response = await API.getProject(id);
                return response.status?response.data:null; 
            } catch (error) {
                console.error(`Failed to fetch data for project ${id}:`, error);
                throw error; 
            }
        }));
    
        // Process the results
        results.forEach(project => {
            if(project!=null){
            console.log(project)
            elem.append(`<li><a href="/manageProject?id=${project.ID}">${project.Name}</a></li>`);
            }
        });
    } catch (error) {
        // This catches any errors from the API calls
        console.error("Error fetching project data:", error);
    }
    
}




$(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('id');    
    let userdata = {};
    if(!userID){
        userdata = await API.getMyInfo(userID);
    }else{
        userdata = await API.getUser(userID);
    }
    if(userdata.status){
        setProfileDetails(userdata.data)
        getRelatedProjects(userdata.data.ProjectsCreated,$("#projectCreatedList"));
        getRelatedProjects(userdata.data.ProjectsInterested,$("#projectInterestedList"));
    }

    $("#connect").click(async()=>{
        setLoader();
        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('id');   
        console.log('Sending connection request to: ' + userID)
        await API.connectWithUser(userID).then(response => {
            if(response.status){
                setResponse(response.response,"green");
            }else{
                setResponse(response.response,"red");
            }
        }).catch(err => {
            console.error("Error sending connection request: " + err);
        })
    })

})
