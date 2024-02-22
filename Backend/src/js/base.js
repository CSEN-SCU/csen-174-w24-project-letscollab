
$(function() {
    $('#showpassword').on("click",function(){
        var type = $('#password').attr('type') === 'password' ? 'text' : 'password';
        $('#password').attr('type', type);
        $('#showPasswordLabel').text(type === 'password' ? 'Show:' : 'Hide:');
      });
      $('#showPasswordLogo').hover(function(){
        var type = $('#password').attr('type') === 'password' ? 'text' : 'password';
        $('#password').attr('type', type);
      });
      let firstname = localStorage.getItem("FirstName").toUpperCase();
      let lastname = localStorage.getItem("LastName").toUpperCase();
      $("#usericon p").html(`${firstname[0]}${lastname[0]}`)
})





