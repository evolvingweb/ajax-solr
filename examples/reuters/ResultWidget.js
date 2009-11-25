(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  beforeRequest: function () { // animation
    $(this.target).html($('<img/>').attr('src', 'ajax-loader.gif'));
  },

  facetLinks: function (widgetId, values) {
    var links = [];

    var me = this;
    for (var i = 0, l = values.length; i < l; i++) {
      links.push(AjaxSolr.theme('facet_link', values[i], function () {
        me.manager.store.remove('fq');
        me.manager.widgets[widgetId].selectItem(values[i]);
        me.manager.doRequest(0);
        return false;
      }));
    }

    return links;
  },

  afterRequest: function () {
    $(this.target).empty();

    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var item = this.manager.response.response.docs[i];

      $(this.target).append(AjaxSolr.theme('result', item, AjaxSolr.theme('snippet', item)));

      var items = [];
      items.concat(this.facetLinks('topics', item.topics));
      items.concat(this.facetLinks('organisations', item.organisations));
      items.concat(this.facetLinks('exchanges', item.exchanges));
      AjaxSolr.theme('list_items', 'links_' + item.id, items);
    }
  },

  init: function () {
    $('a.more').livequery('toggle', function () {
      $(this).parent().find('span').show();
      $(this).text('less');
      return false;
    }, function () {
      $(this).parent().find('span').hide();
      $(this).text('more');
      return false;
    });
  }
});

})(jQuery);