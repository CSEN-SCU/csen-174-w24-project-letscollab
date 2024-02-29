/**
 * Password click icon functionality
 */
$(function() {
    $('#showpassword').on("click",function(){
        let type = $('#password').attr('type') === 'password' ? 'text' : 'password';
        $('#password').attr('type', type);
        $('#showPasswordLabel').text(type === 'password' ? 'Show:' : 'Hide:');
    });
});

/**
 * Password hover icon functionality
 */
$(function() {
    $('#showPasswordLogo').hover(function(){
        let type = $('#password').attr('type') === 'password' ? 'text' : 'password';
        $('#password').attr('type', type);
    });
});

/**
 * Initializes user icon text on every page (the thing in the top right)
 */
$(() => {
    $("#usericon p").html(`${localStorage.getItem("FirstName").charAt(0).toUpperCase()}${localStorage.getItem("LastName").charAt(0).toUpperCase()}`);
    $("#usericon").click(() => {window.location.href = "/profile"});
});

/**
 * Creates a skill element in the proper container
 * @param container JQuery element where the skill will go
 * @param skill Skill object data
 * @param userSkills Array of user skills
 */
const createProfileSkill = (container, skill, userSkills) => {
    // Create new element and append it to the appropriate container
    const newSkill = $("<div>");
    newSkill.addClass(`skill ${skill.skillType}`);

    const newSkillIcon = $("<p>");
    newSkillIcon.addClass("skillicon");
    newSkillIcon.text("•");

    const newSkillName = $("<p>");
    newSkillName.addClass("skillname");
    newSkillName.text(skill.skillName);

    newSkill.append(newSkillIcon, newSkillName);
    container.append(newSkill);

    // Check if the skill is in the user's skill list and make it selected if it is
    if (userSkills.includes(skill.skillName)) {
        newSkill.addClass("selected");
    }

    // Create event listener for skill buttons
    newSkill.click(() => {
        if (newSkill.hasClass("selected")) {
            newSkill.removeClass("selected");
        } else {
            newSkill.addClass("selected");
        }
    });
}

/**
 * Ensures that a form's data is not empty
 * @param formDataObj Form data
 * @returns {boolean} true
 */
function validateForm(formDataObj){
    if(formDataObj["FirstName"] == "")return false;
    if(formDataObj["LastName"] == "")return false;
    if(formDataObj["Email"] == "")return false;
    if(formDataObj["Description"] == "")return false;
    if(formDataObj["Password"] == "") return false;
    return true;
}

/**
 * Function used by the skill search bar to manage the hiding and showing of skills
 * @param {string}search the .val() property of a search bar
 */
const manageDisplayedSkills = (search) => {
    search = search.toLowerCase();
    console.log(search);
    const allSkills = $(".skill");
    allSkills.each((index, skill) => { // For every skill...
        if ($(skill).find(".skillname").html().toLowerCase().includes(search)) { // If it is in the search params remove the hidden attribute
            $(skill).removeClass("hidden");
        } else { // Otherwise hide it
            $(skill).addClass("hidden");
        }
    });
}