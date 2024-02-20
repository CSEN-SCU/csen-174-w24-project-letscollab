const submitFormButton = document.getElementById("submit");
const loginForm = document.getElementById("login");
const createButton = document.getElementById("create");

createButton.addEventListener("click", () => {
    window.location.href = "/profile";
});
loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = new FormData(loginForm);
    if(form.get("email")==""){
        return $('#response').html("Missing Username").css("color","red");
    }
    if(form.get("password")==""){
        return $('#response').html("Missing Password").css("color","red");
    }
    $('#loader').show();
    $('#response').html('');
    API.getLogin(form.get("email"),form.get("password")).then(data=>{
        $('#loader').hide();
        if(data.status){
                localStorage.clear();
                for(const [key,value] of Object.entries(data.data)){                
                    localStorage.setItem(key,value);
                }
                $('#response').html(`${data.response}`).css("color","green");
                setTimeout(()=>{
                   window.location.href = "/profile"
                },1500)
            }else{
                $('#response').html(`${data.response}`).css("color","red");
                setTimeout(()=>{
                    $("#response").html("");
                },1500)
            }
            
        }).catch(err=>{//error handling
            $('#loader').hide();
            $('#response').html('Network Error').css('color','red');
        })
})

$(function(){
    $('#loader').hide();
})