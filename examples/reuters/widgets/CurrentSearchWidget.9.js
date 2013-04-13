(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  afterRequest: function () {
    var self = this;
    var links = [];

    var q = this.manager.store.get('q').val();
    if (q != '*:*') {
      links.push($('<a href="#"></a>').text('(x) ' + q).click(function () {
        self.manager.store.get('q').val('*:*');
        self.doRequest();
        return false;
      }));
    }

    var fq = this.manager.store.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
      if (fq[i].match(/[\[\{]\S+ TO \S+[\]\}]/)) {
        var field = fq[i].match(/^\w+:/)[0];
        var value = fq[i].substr(field.length + 1, 10);
        links.push($('<a href="#"></a>').text('(x) ' + field + value).click(self.removeFacet(fq[i])));
      }
      else {
        links.push($('<a href="#"></a>').text('(x) ' + fq[i]).click(self.removeFacet(fq[i])));
      }
    }

    if (links.length > 1) {
      links.unshift($('<a href="#"></a>').text('remove all').click(function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.remove('fq');
        self.doRequest();
        return false;
      }));
    }

    if (links.length) {
      var $target = $(this.target);
      $target.empty();
      for (var i = 0, l = links.length; i < l; i++) {
        $target.append($('<li></li>').append(links[i]));
      }
    }
    else {
      $(this.target).html('<li>Viewing all documents!</li>');
    }
  },

  removeFacet: function (facet) {
    var self = this;
    return function () {
      if (self.manager.store.removeByValue('fq', facet)) {
        self.doRequest();
      }
      return false;
    };
  }
});

})(jQuery);
