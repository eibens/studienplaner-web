Hyphenator.run();
new WOW().init();

(function () {
  var pageNav = $("a[href^='#']");

  // Scroll smoothly when navigating between pages.
  pageNav.bind("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("href");
    $("html, body").stop().animate({
      scrollTop: $(id).offset().top
    }, 300);
  });

  // Prevent context menu on long-press in Android browsers.
  pageNav.bind("contextmenu", function (event) {
    event.preventDefault();
    $(this).click();
  });
})();

function updatePages() {
  var doc = $(document);
  var documentTop = 0;
  var documentBottom = doc.outerHeight();

  var win = $(window);
  var windowTop = doc.scrollTop();
  var windowBottom = windowTop + win.outerHeight();

  var body = $("body");
  body.toggleClass("top", windowTop == documentTop);
  body.toggleClass("bottom", windowBottom == documentBottom);
}

updatePages();
$(window).scroll(function () {
  updatePages();
});
