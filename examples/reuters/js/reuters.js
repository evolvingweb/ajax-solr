var Manager;

(function ($) {

   $(function(){
    Manager = new AjaxSolr.Manager({
	  solrUrl: 'http://80.28.253.45:8080/solr/collection2/'
    });

   Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));

   Manager.addWidget(new AjaxSolr.MapQuery({
      id: 'map',
      target: '#map'
    }));
	
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
      }
    }));

    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));

    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'comment_user_id', 'comment_id',  ]
    }));

    Manager.init();

    var query = "*:*";
    Manager.store.addByValue('q', query );

    var params = {
      facet: true,
	  indent: true,
      'facet.field': [ 'comment_user_id', 'comment_date', 'comment_id', 'comment_content','geo_loc'],
      'facet.limit': 20,
      'facet.mincount': 1,
      'f.topics.facet.limit': 50,
      'facet.date': 'comment_date',
      'facet.date.start': '2006-02-26T00:00:00.000Z/DAY',
      'facet.date.end': '2006-03-20T00:00:00.000Z/DAY+1DAY',
      'facet.date.gap': '+1DAY',
      'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
	Manager.store.addByValue('facet.pivot', '_lat,_long');
    Manager.doRequest();
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);
