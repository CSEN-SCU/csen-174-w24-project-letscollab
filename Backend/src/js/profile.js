const fs = require('fs');
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
    /*createSkill("Python", "cs");
    createSkill("C++", "cs");
    createSkill("Java", "cs");
    createSkill("Business Stuff", "business");
    createSkill("Accounting", "business");*/
    let file = "";
    fs.readFile(file, "utf8", (error, data) => {
        if (error) {
            console.log("Error loading " + file);
        } else {
            for (let x in data) {
                createSkill(x.skillName, x.skillType);
            }
        }
    });
})

$(function(){
    let firstname = localStorage.getItem("FirstName");
    let lastname = localStorage.getItem("LastName");
    $("#usericon p").html(`${firstname[0]}${lastname[0]}`)
    $('#firstname').val(firstname);
    $('#lastname').val(lastname);
    $('#password').val(localStorage.getItem("Password"));
    $('#email').val(localStorage.getItem("Email"));
    $('#year').val(localStorage.getItem("Year"));
    $('#description').val(localStorage.getItem("Description"));
    var skills = localStorage.getItem("Skills").split(',');
    console.log(skills);
    $.each(skills, function(index, word) {
        transferSkill(1,word,"cs");

    });
})

editProfileForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = new FormData(editProfileForm);
    const formDataObj = Object.fromEntries(form.entries());
    formDataObj["Skills"] = getSkillNamesArray();
    $('#response').html('');
    API.updateUser(formDataObj).then(data=>{
        if(data.status){
            $("#response").html(data.response).css("color","green");
            for(const [key,value] of Object.entries(data.data)){
                localStorage.setItem(key,value);
            }
        }else{
            $("#response").html(data.response).css("color","red");
        }
        setTimeout(()=>{
            $("#response").html("");
        },1500)
    })
})
