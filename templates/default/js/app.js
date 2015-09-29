$(document).ready(function(){

  function setContent (to) {
	$(to + "-id").fadeIn();
	((to=="#info") ? $("#readme-id") : $("#info-id")).fadeOut();
  }

  $(".menu-button").click(function () {
  	setContent($(this).attr('goto'));
  });

  setContent('readme');
  
  function checkServer () {
    $.ajax({
      url : 'running',
      success : function () {
        setTimeout(checkServer, 1000);
      },
      error : function () {
        window.close();
      }
    });
  }
  
  checkServer();
});

$(window).bind("beforeunload", function() { 
    $.ajax({ url : "stop" });
})