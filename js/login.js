/*
function do() {
    alert("Hello");
}
// external.js or in another <script> tag in HTML
document.getElementById('submitbutton').addEventListener('click', do);*/
$(function() {
    function loadJSON(callback) {
        fetch('../data/data.json')
            .then(response => response.json())
            .then(data => callback(null, data))
            .catch(error => callback(error, null));
    }
    $("#submitbutton").click(
        function() {
            var username = $('#username').prop('value');
            var password = $('#password').prop('value');
            if (username === "") {
                alert("You did not enter a username!");
            } else if (password === "") {
                alert("You did not enter a password!");
            } else  {
                loadJSON((error, jsonData) => {
                    if (error) {
                        console.error('Error loading JSON:', error);
                    } else {
                        console.log('JSON data loaded:', jsonData);
                        //alert((userData.password === password) ? "Correct password" : "Wrong password");
                        if (jsonData[username].password === password) {
                            window.location.href = "home.html";
                        } else {
                            alert("Incorrect password for " + username);
                            $('#password').val("");
                        }
                    }
                });
            }
        }
    )
})