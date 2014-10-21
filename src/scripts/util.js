// Utility function to check the existance of all needles with the haystack
function containsAll(needles, haystack) {
  for(var i = 0 , len = needles.length; i < len; i++){
    if($.inArray(needles[i], haystack) === -1) return false;
  }
  return true;
}

function clearField(index,value) {
  value.val('');
  value.removeAttr('data-invalid');
  value.removeAttr('aria-invalid');
  value.removeClass('error');
  value.parent().removeClass('error');
}

function invalidateField(index,field) {
  if (field.val().length === 0) {
    field.attr('data-invalid', '');
    field.attr('aria-invalid', true);
    field.parent().addClass("error");
  } 
}
