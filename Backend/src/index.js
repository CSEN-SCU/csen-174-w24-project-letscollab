
let doc = document.getElementById("textContent");
let btn = document.getElementById("fetch");
let form = document.getElementById("get-project");
let selector = document.getElementById("id");


form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const formData = new FormData(form); // Create a FormData object from the form
    fetch(`http://localhost:8080/projects?id=${formData.get("id")}`, { // Replace 'your-server-endpoint' with your server URL
        method: 'GET',
    })
    .then(response => response.json()) // Assuming the server responds with JSON
    .then(data => {
        doc.textContent = JSON.stringify(data);
    })
    .catch(error => console.error('Error:', error));
})


function fetchproject(){
    fetch("http://localhost:8080/projects/1").then(response=>{
        return response.ok ? response.json() : Promise.reject(response.status);
    }).then(responsejson=>{
        doc.textContent = JSON.stringify(responsejson);
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