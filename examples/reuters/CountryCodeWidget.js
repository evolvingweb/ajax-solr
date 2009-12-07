(function ($) {

AjaxSolr.CountryWidget = AjaxSolr.AbstractFacetWidget.extend({
  limit: -1,

  /**
   * The width of the map images.
   *
   * @field
   * @public
   * @type Number
   * @default 350
   */
  width: 350,

  /**
   * The height of the map images.
   *
   * @field
   * @public
   * @type Number
   * @default 180
   */
  height: 180,

  _handleResult: function () {
    var value;
    if (this.selectedItems.length) {
      value = this.selectedItems[0];
    }
    else {
      value = '-';
    }
    $('select#letter').val(value);
  },

  _handleResult: function() {
    $(this.target).empty();

    var container = $('<div/>').attr('id',  'ajaxsolr_' + this.id).appendTo(this.target);
    var regionSelect = $('<select/>').appendTo(container);
    var me = this;
    regionSelect.change(function () {
      $('#ajaxsolr_' + me.id + ' img').each(function (i,item) {
            $(item).css('display', 'none');
          });
      $('#ajaxsolr_' + me.id + this[this.selectedIndex].value).css('display', 'block');
    });
/// TODO above this point

    var options = {
      world: 'view the World',
      africa: 'view Africa',
      asia: 'view Asia',
      europe: 'view Europe',
      middle_east: 'view the Middle East',
      south_america: 'view South America',
      usa: 'view North America'
    };

    for (var value in options) {
      $('<option/>').text(options[value]).attr('value', value).appendTo(regionSelect);
    }

    var countrySelect = $('<select/>').appendTo(container);
    countrySelect.change(function () {
      var value = $(this).val();
      if (value === '-') {
        if (me.clear()) {
          me.manager.doRequest(0);
        }
      }
      else {
        if (me.selectItems([ value ])) {
          me.manager.doRequest(0);
        }
      }
      return false;
    });
    $('<option/>').text('--select--').attr('value', '-').appendTo(countrySelect);;

    var maxCount = 0;
    var objectedItems = [];

    for (var facet in this.facetFields) {
      if (facet.length == 2) {
        var count = parseInt(this.facetFields[facet]);
        if (count > maxCount) {
          maxCount = count;
        }
        objectedItems.push({ value: facet, count: count });
      }
    }

    var codes = '';
    var mapvalues = [];

    for (var i = 0; i < objectedItems.length; i++) {
      var tagvalue = parseInt(objectedItems[i].count / maxCount * 100);

      codes += objectedItems[i].value;
      mapvalues.push(tagvalue + '.0');

      $('<option/>').text(objectedItems[i].value + ' (' + objectedItems[i].count + ')').attr('value', objectedItems[i].value).appendTo(countrySelect);
    }

    for (var value in options) {
      var src = 'http://chart.apis.google.com/chart?chco=f5f5f5,edf0d4,6c9642,365e24,13390a&chd=t:' + mapvalues.join(',') + '&chf=bg,s,eaf7fe&chtm=' + value + '&chld=' + codes + '&chs=' + this.width + 'x' + this.height + '&cht=t';
      $('<img/>').attr('id', 'ajaxsolr_' + this.id + value).css('display', value == 'world' ? 'block' : 'none').attr('src', src).appendTo(container);
    }
  }
});
