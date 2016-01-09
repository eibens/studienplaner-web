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

$(window).on("hashchange", function (event) {
  console.log("hash");
  event.preventDefault();
});

(function () {
  var lastId;
  var toolbar = $("#toolbar");
  var menuItems = toolbar.find("li a");
  var pages = $(".page");

  $(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var visitedPages = pages.filter(function(){
      return $(this).offset().top <= scrollTop;
    });

    var activePage = $(visitedPages[visitedPages.length - 1]);
    var id = activePage && activePage.length ? activePage[0].id : "";

    if (lastId !== id) {
      lastId = id;
      menuItems.each(function (i, menuItem) {
        menuItem = $(menuItem);
        menuItem.removeClass("active");
        if (menuItem.attr("href") == "#" + id) {
          menuItem.addClass("active");
        }
      })
    }
  });
})();
