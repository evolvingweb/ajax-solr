(function (callback) {
  if (typeof define === 'function' && define.amd) {
    define(['core/AbstractFacetWidget'], callback);
  }
  else {
    callback();
  }
}(function () {

(function ($) {

AjaxSolr.CountryCodeWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;

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
    $(this.target).append(this.template('country', options));

    $(this.target).find('#country').change(function () {
      var value = $(this).val();
      if (value && self.add(value)) {
        self.doRequest();
      }
    });
  },

  template: function (name, container) {
    var options = [];
    for (var value in container) {
      options.push('<option value="' + value +'">' + container[value] + '</option>');
    }
    return '<select id="' + name + '" name="' + name + '">' + options.join('\n') + '</select>';
  }
});

})(jQuery);

}));
