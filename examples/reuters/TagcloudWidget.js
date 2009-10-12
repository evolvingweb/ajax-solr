(function ($) {

AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
  handleResult: function (data) {
    if (this.facetFields.length == 0) {
      $(this.target).html(AjaxSolr.theme('no_items_found'));
      return;
    }

    var maxCount = 0;
    var objectedItems = [];
    for (var facet in this.facetFields) {
      var count = parseInt(this.facetFields[facet]);
      if (count > maxCount) {
        maxCount = count;
      }
      objectedItems.push({
        value: facet,
        count: count
      });
    }

    objectedItems.sort(function (a, b) {
      return a.value < b.value ? -1 : 1;
    });

    var items = [];
    for (var i = 0; i < objectedItems.length; i++) {
      var me = this;
      items.push(AjaxSolr.theme('tag', {
        value: objectedItems[i].value,
        weight: parseInt(objectedItems[i].count / maxCount * 10),
        handler: function () {
          me.selectItems(objectedItems[i].value);
          me.manager.doRequest(0);
        }
      }));
    }
    items.push('<div class="tagcloud_clearer"/>');

    AjaxSolr.theme('list_items', this.target, items);
  }
});

})(jQuery);
