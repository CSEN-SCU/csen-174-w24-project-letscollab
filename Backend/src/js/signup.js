const LISTS = ["#skills", "#addskills"];
const STATES = ["removable", "selectable"];
const editProfileForm = document.getElementById("userform");
function getSkillNamesArray() {
    // Initialize an array to hold the skill names
    let skillNames = [];
  
    // Use jQuery to select each .skillname element and iterate over them
    $('#skills .skillname').each(function() {
        // Add the innerHTML (text content) of each .skillname element to the array
        skillNames.push($(this).text());
    });
  
    return skillNames;
}

function validateForm(formDataObj){
    if (formDataObj["FirstName"] === "") return false;
    if (formDataObj["LastName"] === "") return false;
    if (formDataObj["Email"] === "") return false;
    return formDataObj["Description"] !== "";
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
    newSkill.appendChild(dot);
    newSkill.appendChild(skillName);
    const skillContainer = document.querySelector(LISTS[1]);
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
    newSkill.appendChild(dot);
    newSkill.appendChild(skillName);
    const skillContainer = document.querySelector(LISTS[1 - from]);
    skillContainer.appendChild(newSkill);
    newSkill.addEventListener("click", () => {
        transferSkill(1 - from, skill, category);
    });
    // Remove from bottom list
    const addableSkills = document.querySelector(LISTS[from]);
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
    API.getSkills().then(response => {
        Object.values(response.data).forEach(skill => {
            createSkill(skill.skillName, skill.skillType);
            console.log(`Added skill ${skill.skillName} with type ${skill.skillType}`);
        })
    }).catch(() => {
        console.log("Could not get skills");
    });
})

$(function(){
    localStorage.clear();
    API.getSkills().then(response=>{
        let skillsArray = Object.values(response.data);
        console.log(skillsArray);
        skillsArray.forEach(skill=>{
            createSkill(skill.skillName, skill.skillType);
        }
    )
    }).catch(err=>{
        console.log("Could not get skills");
    })
})


editProfileForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const formDataObj = Object.fromEntries(new FormData(editProfileForm).entries());
    formDataObj["Skills"] = getSkillNamesArray();
    if (!validateForm(formDataObj)) {
        $("#response").html("Missing Field").css("color","red");
        setTimeout(() => {
            $("#response").html("");
        },1500)
        return;
    }
    API.createUser(formDataObj).then(data => {
        if (data.status) {
            $("#response").html(data.response).css("color","green");
            for (const [key, value] of Object.entries(data.data)) {
                localStorage.setItem(key, value);
            }
            setTimeout(()=> {
                window.location.href = "/login"
            },1500)
        } else {
            $("#response").html(data.response).css("color","red");
        }
        setTimeout(() => {
            $("#response").html("");
        },1500)
    })
})

