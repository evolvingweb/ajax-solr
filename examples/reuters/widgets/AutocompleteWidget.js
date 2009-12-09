(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    $(this.target).find('input').val('');

    // TODO need to get facet values without limit

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

    var self = this;
    this.fromAutocomplete = false;
    $(this.target).find('input').autocomplete(list, {
      formatItem: function(facet) {
        return facet.text;
      }
    }).result(function(e, facet) {
      self.fromAutocomplete = true;
      if (self.manager.store.addByValue('fq', facet.field + ':' + facet.value)) {
        self.manager.doRequest(0);
      }
    }).bind('keydown', function(e) {
      if (self.fromAutocomplete === false && e.which == 13) {
        if (self.add($(this).val())) {
          self.manager.doRequest(0);
        }
      }
    });
  }
});

})(jQuery);
