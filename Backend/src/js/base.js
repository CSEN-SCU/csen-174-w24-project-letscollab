
$(function() {
    $('#showpassword').on("click",function(){
        var type = $('#password').attr('type') === 'password' ? 'text' : 'password';
        $('#password').attr('type', type);
        $('#showPasswordLabel').text(type === 'password' ? 'Show:' : 'Hide:');
      });
})


$(function() {
  $('#showPasswordLogo').hover(function(){
      var type = $('#password').attr('type') === 'password' ? 'text' : 'password';
      $('#password').attr('type', type);
    });
})

