// $Id$

/**
 * Baseclass for all free text widgets.
 *
 * @class AbstractTextWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractTextWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstractTextWidget.prototype */
  {
  replace: true,

  alterQuery: function (queryObj) {
    queryObj.q = queryObj.q.concat(this.getItems());
  },

  /**
   * Returns all the selected items as query items.
   *
   * @returns {QueryItem[]}
   */
  getItems: function () {
    var items = [];
    for (var i = 0; i < this.selectedItems.length; i++) {
      items.push(new AjaxSolr.QueryItem({
        value: this.selectedItems[i]
      }));
    }
    return items;
  }
});
