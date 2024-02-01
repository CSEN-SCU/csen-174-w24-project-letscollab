
let doc = document.getElementById("textContent");
let btn = document.getElementById("fetch");
let form = document.getElementById("get-project");
let selector = document.getElementById("id");


form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const formData = new FormData(form); // Create a FormData object from the form
    fetchproject(formData.get("id"));
})


function fetchproject(id){
    fetch(`http://localhost:8080/projects/?id=${id}`).then(response=>{
        return response.ok ? response.json() : Promise.reject(response.status);
    }).then(responsejson=>{
        doc.textContent = JSON.stringify(responsejson,null,2);
    });
}

fetch("http://localhost:8080/projects").then(response=>{
        return response.ok ? response.json() : Promise.reject(response.status);
    }).then(responsejson=>{
        console.log('we made it');
        for(keys in responsejson){
            let atr = document.createElement("option");
            atr.setAttribute("value",responsejson[keys]);
            atr.innerText = responsejson[keys];
            selector.appendChild(atr);
        }
});