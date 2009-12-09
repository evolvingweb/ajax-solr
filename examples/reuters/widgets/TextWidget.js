(function ($) {

AjaxSolr.TextWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;
    $(this.target).find('input').bind('keydown', function(e) {
      if (e.which == 13) {
        if (self.add($(this).val())) {
          self.manager.doRequest(0);
        }
      }
    });
  }
});

})(jQuery);
