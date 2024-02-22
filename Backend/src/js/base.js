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

