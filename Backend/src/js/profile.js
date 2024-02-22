const editProfileForm = document.getElementById("userform");

const getSkillNamesArray = () => {
    // Initialize an array to hold the skill names
    const skillNames = [];
  
    // Use jQuery to select each .skillname element and iterate over them
    $('#addskills .skill').each((index, skill) => {
      // Add the innerHTML (text content) of each .skillname element to the array
        if ($(skill).hasClass("selected")) {
            skillNames.push($(skill).find(".skillname").html());
        }
    });
    return skillNames;
}

$(async () => {
    // Load data from localstorage if it is accessible
    let firstname = localStorage.getItem("FirstName");
    let lastname = localStorage.getItem("LastName");
    $("#usericon p").html(`${firstname[0]}${lastname[0]}`)
    $('#firstname').val(firstname);
    $('#lastname').val(lastname);
    //$('#password').val(localStorage.getItem("Password"));
    $('#email').val(localStorage.getItem("Email"));
    $('#year').val(localStorage.getItem("Year"));
    $('#description').val(localStorage.getItem("Description"));

    // Load skills from user and from server
    const userSkills = localStorage.getItem("Skills").split(",");
    const skillData = await API.getSkills();
    const allSkills = Object.values(skillData.data);
    const skillContainer = $("#addskills");
    console.log(allSkills);
    allSkills.forEach((skill) => {
       createProfileSkill(skillContainer, skill, userSkills);
    });
});

editProfileForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = new FormData(editProfileForm);
    const formDataObj = Object.fromEntries(form.entries());
    formDataObj["Skills"] = getSkillNamesArray();
    $('#response').html('');
    if(!validateForm(formDataObj)){
        $("#response").html("Missing Field").css("color","red");
        setTimeout(()=>{
            $("#response").html("");
        },1500)
        return;
    }
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
    });
});