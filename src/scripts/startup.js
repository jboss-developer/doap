$(document).foundation();
hljs.initHighlightingOnLoad();

// Give them one to fill in
$('a.next.button').on('click', function(event) {
  event.preventDefault();
  event.stopPropagation();

  var nextTab = $('li.tab-title.active').next();
  Foundation.libs.tab.toggle_active_tab(nextTab);
});

