

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

async function getRelatedProjects(projects,elem){
    try {
        const results = await Promise.all(projects.map(async (id) => {
            try {
                const response = await API.getProject(id);
                return response.data; 
            } catch (error) {
                console.error(`Failed to fetch data for project ${id}:`, error);
                throw error; 
            }
        }));
    
        // Process the results
        results.forEach(project => {
            elem.append(`<li><a href="/manageProject?id=${project.ID}">${project.Name}</a><li>`);
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

})
