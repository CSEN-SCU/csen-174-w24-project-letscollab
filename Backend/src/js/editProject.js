// On page load create event listeners
const projectForm = document.getElementById("editproject");
let projectData;
function toUnixTimestamp(date,time){
    // Your date string
    const dateString = `${date} ${time}`

    // Create a Date object
    const date_ = new Date(dateString);

    // Convert to Unix timestamp (in seconds)
    const unixTimestamp = Math.floor(date_.getTime() / 1000);

    return unixTimestamp;

}
$(async () => {
    // Fetch project data from URL param
    const url = new URL(window.location.href);
    let pd;
    try {
        pd = await API.getProject(url.searchParams.get("id"));
    } catch (e) {
        console.log("improper project id given");
        window.location.href = "/projects";
    }

    if (!pd.status) window.location.href = "/projects";
    projectData = pd.data;
    console.log(projectData);

    $("#name").val(projectData.Name);
    $("#description").val(projectData.Description);

    const date = new Date(projectData.Meetup.Time * 1000); // Convert seconds to milliseconds
    // Get the individual date and time components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    $("#time").val(`${hours}:${minutes}:${seconds}`);
    $("#date").val(`${year}-${month}-${day}`);
    $("#locations").val(projectData.Meetup.Location);
    const fff = document.getElementById("peopleRequired").options;
    console.log(projectData.PeopleRequired);
    for (let i = 0; i < fff.length; ++i) {
        if (fff[i].value === projectData.PeopleRequired) {
            fff[i].selected = true;
        }
    }
    //updatePreviewImage(null);

    const previewElement = $(".projectlist img");
    const image = projectData.CoverImage;
    previewElement.attr("src", image);
    updatePreviewName();
    updatePreviewDescription();
    updatePreviewDateTime();
    updatePreviewDateTime();
    updatePreviewLocation();

    // Create input listener for uploading project image
    $("#photo").on("input", (event) => {
        updatePreviewImage(event);
    });

    // Create key listener for project name
    $("#name").on("keyup", () => {
        updatePreviewName();
    });

    // Create key listener for project description
    $("#description").on("keyup", () => {
        updatePreviewDescription();
    });

    // Create input listener for project time
    $("#time").on("input", () => {
        updatePreviewDateTime();
    });

    // Create input listener for project date
    $("#date").on("input", () => {
        updatePreviewDateTime();
    });

    // Create input listener for project location
    $("#locations").on("input", () => {
        updatePreviewLocation();
    });

    // Load skill list
    await loadSkillList();

    // Create keyup listener for skill search bar
    const searchBar = $("#searchskills");
    searchBar.on("input", () => {
        manageDisplayedSkills(searchBar.val());
    });
});

/**
 * Updates the image of the preview display in realtime
 */
const updatePreviewImage = (event) => {
    // Check if there is an image in the upload list
    console.log(event);
    const images = event.target.files;
    if (images.length < 0) return;
    console.log(images[0]);
    const image = URL.createObjectURL(images[0]);
    console.log(image);
    const previewElement = $(".projectlist img");
    previewElement.attr("src", image);

    // Create status message
    const status = $("#uploadstatus");
    status.html("Upload Successful!");
    status.css({
        "color": "green",
        "font-size": "small",
    });
}

/**
 * Updates the title of the preview display in realtime
 */
const updatePreviewName = () => {
    const titleContent = $("#name").val();
    const previewElement = $("article h1");
    if (titleContent.length < 1) {
        previewElement.text("My Project");
    } else {
        previewElement.text(titleContent)
    }
}

/**
 * Updates the description of the preview in realtime
 */
const updatePreviewDescription = () => {
    const descriptionContent = $("#description").val();
    const previewElement = $("p.description");
    if (descriptionContent.length < 1) {
        previewElement.html("Give a detailed explanation of your project");
    } else {
        previewElement.html(descriptionContent);
    }
}

/**
 * Updates the meetup time of the preview in realtime (the regex is ugly, and I'm sorry) <-- its not that bad anymore
 */
const updatePreviewDateTime = () => {
    const previewElement = $(".projectlist .meettime");

    // Number to text month object
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // Gather time data
    const timeContent = $("#time").val();
    if (timeContent) {
        let timeSuffix = "AM";
        let hour = parseInt(timeContent.split(":")[0]);
        let minutes = timeContent.split(":")[1];
        if (hour > 12) { // Account for 24 hour time
            hour -= 12;
            timeSuffix = "PM";
        }
        const timeResult = `${hour}:${minutes} ${timeSuffix}`;

        // Update preview element
        previewElement.html(previewElement.html().replace(/(Meetup Time:\s)(.+)/g, `$1${timeResult}`));
    }

    // Gather date data
    const dateContent = $("#date").val();
    if (dateContent) {
        const year = parseInt(dateContent.split("-")[0]);
        const month = parseInt(dateContent.split("-")[1]);
        const day = parseInt(dateContent.split("-")[2]);


        const dateResult = `${months[month-1]} ${day}, ${year}`;

        // Update preview element
        previewElement.html(previewElement.html().replace(/(Meetup Time:\s)(.+)/g, `$1${dateResult} at $2`));
    }
}

/**
 * Updates the location of the preview in realtime
 */
const updatePreviewLocation = () => {
    const locationContent = $("#locations").val();
    const previewElement = $(".projectlist .meetlocation");

    if (locationContent.length > 1) {
        previewElement.html(previewElement.html().replace(/(Location:\s)(.+)/g, `$1${locationContent}`));
    } else {
        previewElement.html(previewElement.html().replace(/(Location:\s)(.+)/g, "$1x"));
    }
}

/**
 * Loads the general index of skills from skills.json
 */
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
    const container = $("#selectskills");
    skills.forEach((skill) => {
        console.log(typeof skill);
        console.log(skill);
        let selected = false;
        for (let i of projectData["Skills Desired"]) {
            if (i === skill.skillName) selected = true;
        }
        createSkillElement(container, skill, false, selected);
    });
    for (let i of projectData["Skills Desired"]) {
        createSkillElement(container, {skillName: i, skillType: "cs"}, false, true);
    }
}

/**
 * Creates a skill element in a given container
 * @param {object}container Where to put the skill
 * @param {object}skill What the skill is in format {skillName: "name", skillType: "type"}
 * @param {boolean}isPreview Whether the skill is being appended to the preview view or not
 */
const createSkillElement = (container, skill, isPreview, selected) => {
    const newSkill = $("<div>");
    const newSkillIcon = $("<p>");
    const newSkillName = $("<p>");
    // Add event listener to skills only if it is NOT a preview item
    if (!isPreview) {
        if (selected) {
            newSkill.addClass("selected");
            createSkillElement($(".projectlist .skills"), skill, true, true);
        }
        //newSkill.addClass("selected");
        newSkill.click(() => {
            // If the skill exists in the project, remove it
            if (newSkill.hasClass("selected")) {
                newSkill.removeClass("selected");
                removeSkillElement(skill.skillName);
            } else { // Otherwise, add it
                newSkill.addClass("selected");
                const previewContainer = $(".projectlist .skills");
                createSkillElement(previewContainer, skill, true, true);
            }
        });
    }


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

/**
 * Removes a skill element from the preview based on the name of the skill
 * @param {string}skillName Name of skill
 */
const removeSkillElement = (skillName) => {
    const skills = $(".projectlist .skills").children();
    skills.each((index, skill) => {
        if ($(skill).find(".skillname").html() === skillName) skills.eq(index).remove();
    })
}

function createSkill() {
    let skillName = window.prompt("Enter skill name here:");
    if (skillName !== null) {
        let skillType = window.prompt("Enter \"cs\" for Computer Science, \"business\" for Business, and \"engr\" for Engineering:");
        if (skillType !== null) {
            API.createSkill(skillName, skillType);
            createSkillElement($("#selectskills"), {skillName: skillName, skillType: skillType}, false);
        }
    }
}

function validateObject(sendObj) {
    let outObj ={
        "status":true,
        "response":"",
    }
    for (const key in sendObj) {
        if (sendObj.hasOwnProperty(key)) {
            if (sendObj[key] === "") {
                outObj["response"] = `Missing ${key}`
                outObj["status"] = false;
                return outObj; // A null value is found
            }

            // Special handling for the nested 'Meetup' object
            if (key === "Meetup") {
                for (const meetupKey in sendObj.Meetup) {
                    if (sendObj.Meetup.hasOwnProperty(meetupKey)) {
                        if (sendObj.Meetup[meetupKey] === null) {
                            outObj["response"] = `Missing ${key}`
                            outObj["status"] = false;
                            return outObj; // A null value is found in the nested object
                        }
                    }
                }
            }
        }
    }

    // Special handling for the 'Skills Desired' array
    if (Array.isArray(sendObj["Skills Desired"])) {
        if (sendObj["Skills Desired"].length === 0 || sendObj["Skills Desired"].includes(null)) {
            outObj["response"] = `Missing Skills Desired`;
            outObj["status"] = false;
            return outObj; // The array is empty or contains null
        }
    } else {
        outObj["response"] = `Missing Skills Desired`;
        outObj["status"] = false;
        return outObj; // 'Skills Desired' is not an array
    }
    outObj["status"] = true;
    return outObj; // All checks passed
}


function getSkillNamesArray() {
    // Initialize an array to hold the skill names
    var skillNames = [];
    // Use jQuery to select each .skillname element and iterate over them
    $('#selectskills .selected .skillname').each(function() {
      // Add the innerHTML (text content) of each .skillname element to the array
      skillNames.push($(this).text());
    });
  
    return skillNames;
  }
  
function setResponse(text, color){
    $('#formSubmitResponse').html(`${text}`).css("color",color);
    setTimeout(()=>{
        $(this).html("");
    },1500)
}
const fileToDataURL = async(file) =>{
    let reader = new FileReader();
    return new Promise(function (resolve, reject) {
      reader.onload = function (event) {
        let base64DataUrl = event.target.result;
        let base64String = base64DataUrl.split(',')[1];
        resolve(base64String);
      }
      reader.readAsDataURL(file)
    })
  }  


projectForm.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const form = new FormData(projectForm);
    const obj = Object.fromEntries(form.entries());
    let date = toUnixTimestamp(obj["date"],obj["time"]);
    const file = document.getElementById("photo").files[0];
    let imageBase64 = "";
    try {
        imageBase64 = await fileToDataURL(file);
    } catch (e) {
        setResponse("Please upload an image file to your project!", "red");
        return;
    }
    let sendObj = {
        "Name":obj["name"],
        "Description":obj["description"],
        "Meetup":{
            "Time":date,
            "Location":obj["location"]
        },        
        "Skills Desired":getSkillNamesArray(),
        "CoverImage":imageBase64,
        "PeopleRequired":$('#peopleRequired').val()
    }
    let validObject = validateObject(sendObj);
    if(!validObject.status){
        setResponse(validObject.response,"red");
        return;
    }
    API.updateProject(sendObj).then(async data=>{
        if(data.status){
            setResponse(data.response,"green")
        }else{
            setResponse(data.response,"green")
        }

        await delay(2000);

        window.location.href = "/projects";

    }).catch(err=>{
        console.log(err);
        setResponse("Network Error","Red")

    });

});

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}