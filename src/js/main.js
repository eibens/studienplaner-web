Hyphenator.run();
SocialShareKit.init();

$(".no-js").removeClass("no-js");

$(".zoomable").on("click", function (e) {
  e.preventDefault();
  $(this).find("img").toggleClass("zoomed");
});
