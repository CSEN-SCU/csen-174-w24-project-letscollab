/*
function do() {
    alert("Hello");
}
// external.js or in another <script> tag in HTML
document.getElementById('submitbutton').addEventListener('click', do);*/
$(function() {
    $("#submitbutton").click(
        function() {
            //alert("Hello " + $('#username').prop("value"));
            var username = $('#username').prop('value');
            var password = $('#password').prop('value');
            var message = "Your username is " + username;
            var message2 = "Your password is " + password;
            alert(message);
            alert(message2);
        }
    )
})