$(document).foundation();
hljs.initHighlightingOnLoad();

$("#language").zmultiselect({  
    live: false,
    filter: false
});
$("#language").zmultiselect("uncheckall");

// Give them one to fill in
$('#addVersion').trigger('click');
$('#addSpec').trigger('click');
$('#addOnlineAccount').trigger('click');

