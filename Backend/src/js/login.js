const submitFormButton = document.getElementById("submit");
const loginForm = document.getElementById("login");

loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = new FormData(loginForm);
    if(form.get("email")==""){
        return $('#response').html("Missing Username").css("color","red");
    }
    if(form.get("password")==""){
        return $('#response').html("Missing Password").css("color","red");
    }
    const params = {
        "email":form.get("email"),
        "password":form.get("password")
    }
    $.ajax({
        url:"/v1/getLogin",
        type:"GET",
        data:params,
        success:function(response,textStatus,xhr){
            $('#response').html(response.status?"Login Success":response.data).css('color',response.status ?'green':'red');
            //window.location.href = ""
        },
        error:function(xhr,status,error){
            $('#response').html('Network Error').css('color','red');
        }
    })
})

