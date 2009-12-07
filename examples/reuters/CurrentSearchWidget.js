(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  afterRequest: function () {
    var self = this;
    var links = [];

    var q = this.manager.store.get('q').val();
    if (q) {
      links.push($('<a href="#"/>').text('(x) ' + q).click(function () {
        if (self.manager.store.remove('q')) {
          self.manager.doRequest(0);
        }
        return false;
      }));
    }

    var fq = this.manager.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
      links.push($('<a href="#"/>').text('(x) ' + fq[i]).click(function () {
        if (self.manager.store.removeByValue('fq', fq[i])) {
          self.manager.doRequest(0);
        }
        return false;
      }));
    }

    if (links.length > 1) {
      links.unshift($('<a href="#"/>').text('remove all').click(function () {
        self.manager.store.remove('q');
        self.manager.store.remove('fq');
        self.manager.doRequest(0);
        return false;
      }));
    }

    if (links.length) {
      AjaxSolr.theme('list_items', this.target, links);
    }
    else {
      $(this.target).html('<div>Viewing all documents!</div>');
    }
  }
});

})(jQuery);
