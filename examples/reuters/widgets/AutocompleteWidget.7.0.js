(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    $(this.target).find('input').unbind().removeData('events').val('');

    var self = this;

    var list = [];
    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      for (var facet in this.manager.response.facet_counts.facet_fields[field]) {
        list.push({
          field: field,
          value: facet,
          text: facet + ' (' + this.manager.response.facet_counts.facet_fields[field][facet] + ') - ' + field
        });
      }
    }

    this.requestSent = false;
    $(this.target).find('input').unautocomplete().autocomplete(list, {
      formatItem: function(facet) {
        return facet.text;
      }
    }).result(function(e, facet) {
      self.requestSent = true;
      if (self.manager.store.addByValue('fq', facet.field + ':' + AjaxSolr.Parameter.escapeValue(facet.value))) {
        self.manager.doRequest(0);
      }
    });

    // This has lower priority so that requestSent is set.
    $(this.target).find('input').bind('keydown', function(e) {
      if (self.requestSent === false && e.which == 13) {
        var value = $(this).val();
        if (value && self.add(value)) {
          self.manager.doRequest(0);
        }
      }
    });
  }
});

})(jQuery);
