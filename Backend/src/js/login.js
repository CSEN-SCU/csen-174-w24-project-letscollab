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
function checkStatusIsDone() {
    // Create a URL object
    const urlObj = new URL(window.location.href);
    // Use URLSearchParams to easily access the query parameters
    const queryParams = new URLSearchParams(urlObj.search);
    // Check if the 'status' parameter is exactly 'done'
    return queryParams.get('status') != null;
}

function getRedirectTo() {
    // Create a URL object
    const urlObj = new URL(window.location.href);
    // Use URLSearchParams to easily access the query parameters
    const queryParams = new URLSearchParams(urlObj.search);
    // Check if the 'status' parameter is exactly 'done'
    console.log('Redirect to set to ' + queryParams.get('redirectTo'));
    return queryParams.get('redirectTo')
}


$(function(){
    if(checkStatusIsDone()){
        API.getMyInfo().then(data=>{
            if(data.status){
                localStorage.clear();
                for(const [key,value] of Object.entries(data.data)){                
                    localStorage.setItem(key,value);
                }
                setResponse(data.response,"green");
                let redirectTo = getRedirectTo();
                let basePath = window.location.origin;
                window.location.href = redirectTo?basePath+redirectTo:"/projects";

            }else{
                setResponse(data.response,"red");
                setElementShake("#response");   
                setTimeout(()=>{
                    window.location.href = "/login";
                    },1500)
            }
        }).catch(err=>{
            setResponse("Network err","red");
            setTimeout(()=>{
                window.location.href = "/login"
                },1500)
        })
    }else{
        $('#loader').hide();
        API.getGoogleAuthURL().then(data=>{
            if(data.status){
                $("#authUrl").attr("href",data.data.url);
            }else{
                setResponse(data.response,"red");
            }
        }).catch(err=>{
            setResponse(err.message,"red");
        })
    }
})