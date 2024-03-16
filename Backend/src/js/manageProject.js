let id;
function setResponse(text, color){
    $('#manageResponse').html(`${text}`).css("color",color);
    setTimeout(()=>{
        $("#manageResponse").html("");
    },1500)
}
let userInfo = {};
/**
 * showInterest ()
 * @button was pressed
 * @projObj project object we are marking (dis)interest in
 * 
 */
async function showInterest(button, projObj)
{

    let isSelected = button.html() == "Show Interest";
    /** update userProfiles and projects json files with API call */
    await API.setProjectInterest(projObj.ID,isSelected).then(response => {
        if(response){
            if(isSelected){
                button.html("Remove Interest");
            }else{
                
                button.html("Show Interest");
            }
            setResponse(response.response,"green");
        }else{
            setResponse("Error marking interest in project","red"); //error message
        }
       //set project interest

    }).catch(err => {
        console.error("error marking interest in project: " + err);
    })

    /** UPDATE user info from the API */
    await API.getMyInfo().then(response => {
        userInfo = response.data;
    }).catch(err => {
        console.error("error updating user info: " + err);
    })
}

$(async () => {
    // Get list of all current skills
    await API.getMyInfo().then(response => {
        userInfo = response.data;
    }).catch(err => {
        console.error("error fetching user info: " + err);
    })
    let allSkills = await API.getSkills();
    allSkills = allSkills.data;

    // Fetch project data from URL param
    const url = new URL(window.location.href);
    let projectData;
    try {
        projectData = await API.getProject(url.searchParams.get("id"));
    } catch (e) {
        console.log("improper project id given");
        window.location.href = "/projects";
    }

    if (!projectData.status) window.location.href = "/projects";
    projectData = projectData.data;

    // Fill out relevant project information
    console.log(projectData);
    id = projectData.ID;
    $("#project aside h1").html(projectData.Name); // Name
    $("#project aside #description").html(projectData.Description); // Description
    $("#project figure img").attr("src", projectData.CoverImage.length > 0 ? (projectData["CoverImage"].startsWith("https://")? projectData["CoverImage"]:"data:image/png;base64," + projectData.CoverImage): "https://cdn-icons-png.flaticon.com/512/2103/2103930.png"); // Cover image
    $("#project aside #meetlocation").html(`Meetup Location: ${projectData.Meetup.Location}`); // Meetup location
    $("#project aside #projectowner").html(`Project Creator: ${projectData.AuthorEmail}`);
    // Project date
    const date = new Date(projectData.Meetup.Time * 1000);
    $("#project aside #meettime").html("Meetup Time: " + date.toLocaleString());
    let emailMembersBtn = $("#emailmembers");
    emailMembersBtn.click(async () => {
        console.log(`Notify interested users of prjoect ${projectData.ID} ${projectData.Name}`)
        let data = await API.notifyInterestedUsers(projectData.ID);
        setResponse(data.response,data.status ? "green" : "red");
    });
    // Project skills
    const projectSkillContainer = $("#projectskills");
    projectData["Skills Desired"].forEach((skill) => {
        createSkillElement(projectSkillContainer, allSkills[skill]);
    });

    // Participants Required
    $("#participantscontainer h4").html(`Participants: ${projectData["Interested Users"].length} of ${projectData.PeopleRequired}`);

    // Append user information
    const interestedUsers = []
    for (const email of projectData["Interested Users"]) {
       let userData;
        try {
            userData = await API.getUser(email);
        } catch (e) {
            console.log("Error fetching user");
            return;
        }

        interestedUsers.push(userData.data);
    }

    const participantsList = $("#participants");
    interestedUsers.forEach((user) => {
        const newPerson = $("<li>");

        const name = $("<p>");
        name.html(`${user.FirstName} ${user.LastName}`);
        name.addClass("name");

        const email = $("<p>");
        email.html(user.Email);

        const skillContainer = $("<div>");
        skillContainer.addClass("skills");
        user.Skills.forEach((skill) => {
            if (projectData["Skills Desired"].includes(skill)) createSkillElement(skillContainer, allSkills[skill]);
        });
        newPerson.attr("id", user.Email)
        newPerson.append(name);
        newPerson.append(email);
        newPerson.append(skillContainer);
        newPerson.click(() => {
            window.location.href = `/viewProfile?id=${user.Email}`;
        });
        participantsList.append(newPerson);
    });

    // Hide project control panel if user is not owner
    if (localStorage.getItem("Email") !== projectData.AuthorEmail) {
        $("#interestButton").show()
        console.log(interestedUsers, userInfo.Email)
        if(projectData["Interested Users"].includes(userInfo.Email)){
            $("#interestButton").html("Remove Interest");
        }else{
            $("#interestButton").html("Show Interest");
        }
        $("#interestButton").click(async () => {
            let element = $("#interestButton");
            showInterest(element, projectData);
        });
        $("#projectmanagercontrols *, #projectmanagercontrols").hide();
    }else{
        $("#projectmanagercontrols *, #projectmanagercontrols").show();
    }    

    // Create functionality for project control
    const deleteButton = $("#deleteproject");
    deleteButton.click(async () => {
        await API.deleteProject(projectData.ID);
        window.location.href = "/projects";
    });
});

$("#emailmembers").click(function() {
    console.log("Email sent");
});

$("#editproject").click(function() {
    window.location.href = `/editProject?id=${id}`;
});
$("#deleteproject").click(async () => {
        await API.deleteProject(projectData.ID);
        window.location.href = "/projects";
});

const loadSkillList = async () => {
    let skills = {};
    await $.ajax({
        url: "/v1/getSkills",
        type: "GET",
        success: function(response, textStatus, xhr) {
            skills = Object.values(response.data);
        },
        error: function(xhr, status, error) {
            console.log("this is bad. very bad");
        }
    });

    // Add all skills to the proper container
    const container = $(".skills");
    skills.forEach((skill) => {
        createSkillElement(container, skill);
    });
}

const createSkillElement = (container, skill) => {
    const newSkill = $("<div>");
    const newSkillIcon = $("<p>");
    const newSkillName = $("<p>");

    // Add proper classes and content
    newSkill.addClass(`skill ${skill.skillType}`);

    newSkillIcon.addClass("skillicon");
    newSkillIcon.text("•");

    newSkillName.addClass("skillname");
    newSkillName.text(skill.skillName);

    // Create element hierarchy
    newSkill.append(newSkillIcon);
    newSkill.append(newSkillName);
    container.append(newSkill);
}