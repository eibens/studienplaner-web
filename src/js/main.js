Hyphenator.run();

$(".no-js").removeClass("no-js");
$("#feedback-email").val("feedback" + "@" + "studienplaner.at");
$("#contact-email").text("l.eibensteiner" + "@" + "gmail.com");

$(".zoomable").on("click", function (e) {
  e.preventDefault();
  $(this).find("img").toggleClass("zoomed");
});
