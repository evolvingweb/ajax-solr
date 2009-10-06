// $Id$

/**
 * @param target The list to modify.
 * @param items The list of items to append to the list.
 */
AjaxSolr.theme.prototype.list_items = function(list, items, separator) {
  jQuery(list).empty();
  for (var i = 0; i < items.length; i++) {
    var li = jQuery('<li/>');
    if (AjaxSolr.isArray(items[i])) {
      for (var j = 0; j < items[i].length; j++) {
        if (separator && j > 0) {
          li.append(separator);
        }
        li.append(items[i][j]);
      }
    }
    else {
      if (separator && i > 0) {
        li.append(separator);
      }
      li.append(items[i]);
    }
    jQuery(list).append(li);
  }
}
