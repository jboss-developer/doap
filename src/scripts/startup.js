$(document).foundation();
hljs.initHighlightingOnLoad();

// Give them one to fill in
$('#addVersion').trigger('click');
$('#addSpec').trigger('click');
$('#addOnlineAccount').trigger('click');
$('a.next.button').on('click', function(event) {
  event.preventDefault();
  event.stopPropagation();

  var nextTab = $('li.tab-title.active').next();
  Foundation.libs.tab.toggle_active_tab(nextTab);
});
