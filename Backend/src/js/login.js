const submitFormButton = document.getElementById("submit");
const loginForm = document.getElementById("login");
const createButton = document.getElementById("create");

function setElementShake(elementValue){
    $(elementValue).addClass('incorrect');
    setTimeout(()=>{
        $(elementValue).removeClass("incorrect");
    },1500)
}

function setResponse(text, color){
    $('#loader').hide();
    $('#response').html(`${text}`).css("color",color);
    setTimeout(()=>{
        $("#response").html("");
    },1500)
}
createButton.addEventListener("click", () => {
    window.location.href = "/signup";
});
loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = new FormData(loginForm);
    if(form.get("email")==""){
        setElementShake("#submit");
        return setResponse("Missing Username","red");
    }
    if(form.get("password")==""){
        setElementShake("#submit");
        return setResponse("Missing Password","red");
    }
    $('#loader').show();
    $('#response').html('');
    setTimeout(()=>{
        API.getLogin(form.get("email"),form.get("password")).then(data=>{
            if(data.status){
                localStorage.clear();
                for(const [key,value] of Object.entries(data.data)){
                    localStorage.setItem(key,value);
                }
                setResponse(data.response,"green");
                setTimeout(()=>{
                    window.location.href = "/profile"
                },1500)

            }else{
                setResponse(data.response,"red");
                setElementShake("#response");
            }
        }).catch(err=>{//error handling
            setResponse("Network Error","red");
        })
    },500)
})

$(function(){
    $('#loader').hide();
})