(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractResultWidget.extend({
  startAnimation: function () {
    $(this.target).html($('<img/>').attr('src', 'ajax-loader.gif'));
  },

  facetLinks: function (widgetId, values) {
    var links = [];

    var me = this;
    for (var i = 0, length = values.length; i < length; i++) {
      links.push(AjaxSolr.theme('facet_link', values[i], function () {
        me.manager.reset();
        me.manager.widgets[widgetId].selectItems([ values[i] ]);
        me.manager.doRequest(0);
        return false;
      }));
    }

    return links;
  },

  handleResult: function (data) {
    $(this.target).empty();

    for (var i = 0, length = data.response.docs.length; i < length; i++) {
      var item = data.response.docs[i];

      $(this.target).append(AjaxSolr.theme('result', item, AjaxSolr.theme('snippet', item)));

      var items = [];
      items.concat(this.facetLinks('topics', item.topics));
      items.concat(this.facetLinks('organisations', item.organisations));
      items.concat(this.facetLinks('exchanges', item.exchanges));
      AjaxSolr.theme('list_items', 'links_' + item.id, items);
    }
  },

  afterAdditionToManager: function () {
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