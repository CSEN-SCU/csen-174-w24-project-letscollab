const LISTS = ["#skills", "#addskills"];
const STATES = ["removable", "selectable"];
const editProfileForm = document.getElementById("userform");
function getSkillNamesArray() {
    // Initialize an array to hold the skill names
    var skillNames = [];
  
    // Use jQuery to select each .skillname element and iterate over them
    $('#skills .skillname').each(function() {
      // Add the innerHTML (text content) of each .skillname element to the array
      skillNames.push($(this).text());
    });
  
    return skillNames;
  }

function validateForm(formDataObj){
    if(formDataObj["FirstName"] == "")return false;
    if(formDataObj["LastName"] == "")return false;
    if(formDataObj["Email"] == "")return false;
    if(formDataObj["Description"] == "")return false;
    return true;
  }
  
    
function createSkill(skill, category) {
    const newSkill = document.createElement("div");
    const dot = document.createElement('p');
    const skillName = document.createElement('p');
    dot.classList.add("skillicon");
    dot.textContent = "•";
    skillName.classList.add("skillname");
    skillName.textContent = skill;
    newSkill.classList.add("skill");
    newSkill.classList.add(category);
    newSkill.classList.add(STATES[1]);
    //newSkill.classList.add("skill cs removable");
    newSkill.appendChild(dot);
    newSkill.appendChild(skillName);
    const skillContainer = document.querySelector(LISTS[1]);/*"#skills" is the top list*/
    skillContainer.appendChild(newSkill);
    newSkill.addEventListener("click", () => {
        transferSkill(1, skill, category);
    });
    
}
function transferSkill(from, skill, category) {
    // Add to top list
    const newSkill = document.createElement("div");
    const dot = document.createElement('p');
    const skillName = document.createElement('p');
    dot.classList.add("skillicon");
    dot.textContent = "•";
    skillName.classList.add("skillname");
    skillName.textContent = skill;
    newSkill.classList.add("skill");
    newSkill.classList.add(category);
    newSkill.classList.add(STATES[1 - from]);
    //newSkill.classList.add("skill cs removable");
    newSkill.appendChild(dot);
    newSkill.appendChild(skillName);
    const skillContainer = document.querySelector(LISTS[1 - from]);/*"#skills" is the top list*/
    skillContainer.appendChild(newSkill);
    newSkill.addEventListener("click", () => {
        transferSkill(1 - from, skill, category);
    });
    // Remove from bottom list
    const addableSkills = document.querySelector(LISTS[from]);/*"#addskills" is the bottom list*/
    const skillArray = addableSkills.querySelectorAll(".skill");
    for (let i = 0; i < skillArray.length; ++i) {
        let div = skillArray.item(i);
        if (div.querySelector(".skillname").textContent === skill) { // Remove
            addableSkills.removeChild(div);
            break;
        }
    }
}

$(function() {
    createSkill("Python", "cs");
    createSkill("C++", "cs");
    createSkill("Java", "cs");
    createSkill("Business Stuff", "business");
    createSkill("Accounting", "business");
})

$(function(){
    localStorage.clear();
})

editProfileForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = new FormData(editProfileForm);
    const formDataObj = Object.fromEntries(form.entries());
    formDataObj["Skills"] = getSkillNamesArray();
    if(!validateForm(formDataObj)){
        $("#response").html("Missing Field").css("color","red");
        setTimeout(()=>{
            $("#response").html("");
        },1500)
        return;
    }
    API.createUser(formDataObj).then(data=>{
        if(data.status){
            $("#response").html(data.response).css("color","green");
            for(const [key,value] of Object.entries(data.data)){
                localStorage.setItem(key,value);
            }
            setTimeout(()=>{
                window.location.href = "/login"
             },1500)
        }else{
            $("#response").html(data.response).css("color","red");
        }
        setTimeout(()=>{
            $("#response").html("");
        },1500)
    })
})

