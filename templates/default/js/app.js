$(document).ready(function(){

  function setContent (to) {
	$(to + "-id").fadeIn();
	((to=="#info") ? $("#readme-id") : $("#info-id")).fadeOut();
  }

  $(".menu-btn").click(function () {
  	setContent($(this).attr('goto'));
  });

  setContent('readme');
});

$(window).bind("beforeunload", function() { 
    $.ajax({ url : "stop" });
})