(function ($) {

// For a TextWidget that uses the q parameter, see:
// https://github.com/evolvingweb/ajax-solr/blob/gh-pages/examples/reuters/widgets/TextWidget.q.js
AjaxSolr.TextWidget = AjaxSolr.AbstractFacetWidget.extend({
  init: function () {
    var self = this;
    $(this.target).find('input').bind('keydown', function(e) {
      if (e.which == 13) {
        var value = $(this).val();
        if (value && self.add(value)) {
          self.manager.doRequest(0);
        }
      }
    });
  },

  afterRequest: function () {
    $(this.target).find('input').val('');
  }
});

})(jQuery);
