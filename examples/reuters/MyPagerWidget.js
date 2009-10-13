(function ($) {

AjaxSolr.MyPagerWidget = AjaxSolr.PagerWidget.extend({
  prevLabel: '<',
  nextLabel: '>',
  innerWindow: 0,

  renderHeader: function (perPage, offset, total) {
    $('<span/>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total).appendTo(this.target);
  }
});

})(jQuery);
