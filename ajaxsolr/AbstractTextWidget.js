// $Id$

AjaxSolr.AbstractTextWidget = AjaxSolr.AbstractWidget.extend({
  replace: true,

  alterQuery: function(queryObj) {
    queryObj.q = queryObj.q.concat(this.getItems());
  },

  /**
   * Returns all the selected items as query items.
   *
   * @return An array of QueryItem objects.
   */
  getItems: function() {
    var items = [];
    for (var i = 0; i < this.selectedItems.length; i++) {
      items.push(new AjaxSolr.QueryItem({
        value: this.selectedItems[i],
        widgetId: this.id
      }));
    }
    return items;
  },

  /**
   * @return A function to deselect all but this widget.
   */
  unclickHandler: function() {
    var me = this;
    return function() {
      me.manager.deselectExcept(me.id);
      return false;
    };
  }
});
