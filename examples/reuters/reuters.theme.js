(function ($) {

AjaxSolr.theme.prototype.result = function (item, snippet) {
  var output = '<div><h2>' + item.title + '</h2>';
  output += '<p id="links_' + item.id + '"></p>';
  output += '<p>' + snippet + '</p></div>';

  return output;
};

AjaxSolr.theme.prototype.snippet = function (item) {
  var output = '';

  if (item.text.length > 300) {
    output += item.dateline + ' ' + item.text.substring(0, 300);
    output += '<span style="display:none;">' + item.text.substring(300);
    output += '</span> <a href="#" class="more">more</a>';
  } else {
    output += item.dateline + ' ' + item.text;
  }

  return output;
};

AjaxSolr.theme.prototype.tag = function (value, weight, handler) {
  return $('<a class="tagcloud_item"/>').text(value).addClass('tagcloud_size_' + weight).click(handler);
};

AjaxSolr.theme.prototype.facet_link = function (value, handler) {
  return $('<a href="#"/>').text(value).click(handler);
};

AjaxSolr.theme.prototype.no_items_found = function () {
  return 'no items found in current selection';
};

})(jQuery);
