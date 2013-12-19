(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(
            $('<a href="#"></a>')
            .text(facet_values[i])
            .click(this.facetHandler(facet_field, facet_values[i]))
          );
        }
        else {
          links.push('no items found in current selection');
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest();
      return false;
    };
  },

  afterRequest: function () {
    $(this.target).empty();
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
      $(this.target).append(this.template(doc));

      var items = [];
      items = items.concat(this.facetLinks('comment_id', doc.comment_id));
      items = items.concat(this.facetLinks('comment_order', doc.comment_order));
      items = items.concat(this.facetLinks('comment_karma', doc.comment_karma));
      items = items.concat(this.facetLinks('comment_randkey', doc.comment_randkey));
      items = items.concat(this.facetLinks('comment_date', doc.comment_date));
      items = items.concat(this.facetLinks('comment_user_id', doc.comment_user_id));
      items = items.concat(this.facetLinks('comment_link_id', doc.comment_link_id));
      items = items.concat(this.facetLinks('comment_content', doc.comment_content));
      items = items.concat(this.facetLinks('comment_votes', doc.comment_votes));
      items = items.concat(this.facetLinks('comment_parent', doc.comment_parent));
      
      
      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }
    }
  },

  template: function (doc) {
    var snippet = '';
    snippet += doc.comment_date + ' -- User id: ' + doc.comment_user_id +'<br\>'
    if (doc.comment_content.length > 300) {
      snippet += doc.comment_content.substring(0, 300);
      snippet += '<span style="display:none;">' + doc.comment_content.substring(300);
      snippet += '</span> <a href="#" class="more">more</a>';
    }
    else {
      snippet += doc.comment_content;
    }

    var output = '<div><h2>' + doc.comment_id + '</h2>';
    output += '<p id="links_' + doc.comment_id + '" class="links"></p>';
    output += '<p>' + snippet + '</p>';
    output += '<br\>Votes: ' + doc.comment_votes + ' -- Order: ' + doc.comment_order + ' -- Karma: ' + doc.comment_karma + '</div>';
    return output;
  },

  init: function () {
    $(document).on('click', 'a.more', function () {
      var $this = $(this),
          span = $this.parent().find('span');

      if (span.is(':visible')) {
        span.hide();
        $this.text('more');
      }
      else {
        span.show();
        $this.text('less');
      }

      return false;
    });
  }
});

})(jQuery);
