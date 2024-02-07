$(function() {
    function loadJSON(callback) {
        fetch('../Backend/studentprofiles.json')
            .then(response => response.json())
            .then(data => callback(null, data))
            .catch(error => callback(error, null));
    }
    $("#submitbutton").click(
        function() {
            let username = $('#username').prop('value');
            let password = $('#password').prop('value');
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
                        if (jsonData[username].Password === password) {
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