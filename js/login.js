/*
function do() {
    alert("Hello");
}
// external.js or in another <script> tag in HTML
document.getElementById('submitbutton').addEventListener('click', do);*/
$(function() {
    var users = new Map();
    $("#submitbutton").click(
        function() {
            //alert("Hello " + $('#username').prop("value"));
            var username = $('#username').prop('value');
            var password = $('#password').prop('value');
            //var message = "Your username is " + username;
            //var message2 = "Your password is " + password;
            if (users.has(username)) {
                if (users.get(username) !== password) {
                    alert("Incorrect password. Try again.");
                } else {
                    alert("You logged in as " + username + " and your password is " + "I ain't telling you shit".substring(0, password.length));
                }
            } else {
                alert("Your account has been added");
                users.set(username, password);
            }
        }
    )
})