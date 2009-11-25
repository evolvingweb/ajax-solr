(function ($) {

AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
  handleFacets: function () {
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
      objectedItems.push({ value: facet, count: count });
    }

    objectedItems.sort(function (a, b) {
      return a.value < b.value ? -1 : 1;
    });

    var items = [];

    var me = this;
    for (var i = 0, l = objectedItems.length; i < l; i++) {
      var facet = objectedItems[i].value;
      items.push(AjaxSolr.theme('tag', facet, parseInt(objectedItems[i].count / maxCount * 10), me.clickHandler(facet)));
    }

    items.push('<div class="tagcloud_clearer"/>');

    AjaxSolr.theme('list_items', this.target, items);
  }
});

})(jQuery);
