Hyphenator.run();
SocialShareKit.init();

$(".no-js").removeClass("no-js");

$(".zoomable").on("click", function (e) {
  e.preventDefault();
  $(this).find("img").toggleClass("zoomed");
});

var body = $("body");
body.addClass("top");
$(document).scroll(function () {
  var scrollTop = $(document).scrollTop();
  if (scrollTop == 0) {
    body.addClass("top");
  } else {
    body.removeClass("top");
  }
});
