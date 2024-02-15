const submitFormButton = document.getElementById("submit");
const loginForm = document.getElementById("login");

loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = new FormData(loginForm);
    API.getLogin(form.get("email"),form.get("password")).then(data=>{
        console.log(data);
        //do stuff with jquery here
    })
})