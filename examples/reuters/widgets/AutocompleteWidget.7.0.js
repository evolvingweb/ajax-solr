(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({
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
          label: facet + ' (' + this.manager.response.facet_counts.facet_fields[field][facet] + ') - ' + field
        });
      }
    }

    this.requestSent = false;
    $(this.target).find('input').autocomplete('destroy').autocomplete({
      source: list,
      select: function(event, ui) {
        if (ui.item) {
          self.requestSent = true;
          if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
            self.doRequest();
          }
        }
      }
    });

    // This has lower priority so that requestSent is set.
    $(this.target).find('input').bind('keydown', function(e) {
      if (self.requestSent === false && e.which == 13) {
        var value = $(this).val();
        if (value && self.set(value)) {
          self.doRequest();
        }
      }
    });
  }
});

})(jQuery);
