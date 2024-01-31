/*
function do() {
    alert("Hello");
}
// external.js or in another <script> tag in HTML
document.getElementById('submitbutton').addEventListener('click', do);*/
$(function() {
    $("#submitbutton").click(
        function() {
            alert("Hello " + $('#username').prop("value"));
        }
    )
})