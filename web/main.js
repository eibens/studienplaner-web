
(function () {
  var pageNav = $(".page .nav");

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

  $(".page").each(function (i, page) {

    page = $(page);
    var pageTop = page.offset().top;
    var pageBottom = pageTop + page.outerHeight();

    var pageVisible = !(windowBottom <= pageTop || pageBottom <= windowTop);
    page.toggleClass("visible", pageVisible);
    if (pageTop <= windowTop) {
      $(page).addClass("visited");
    }
  });
}

updatePages();
$(window).scroll(function () {
  updatePages();
});
