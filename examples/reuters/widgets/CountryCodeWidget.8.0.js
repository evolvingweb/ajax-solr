(function ($) {

AjaxSolr.CountryCodeWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    $(this.target).empty();

    var maxCount = 0;
    var options = { '': '--select--' };
    for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
      if (facet.length == 2) { // only display country codes
        var count = this.manager.response.facet_counts.facet_fields[this.field][facet];
        if (count > maxCount) {
          maxCount = count;
        }
        options[facet] = facet + ' (' + count + ')';
      }
    }
    $(this.target).append(AjaxSolr.theme('select_tag', 'country', AjaxSolr.theme('options_for_select', options)));

    var self = this;
    $(this.target).find('#country').change(function () {
      var value = $(this).val();
      if (value && self.add(value)) {
        self.manager.doRequest(0);
      }
    });
  }
});

})(jQuery);
