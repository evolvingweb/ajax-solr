//var ip = location.hostname;
var ip = "localhost";
var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://' + ip + ':8983/solr/collection1/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
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
    /*var fields = ['comment_id', 'comment_order', 'comment_karma', 'comment_randkey', 'comment_date', 'comment_user_id', 'comment_link_id', 'comment_content', 'comment_votes', 'comment_parent' ];*/
    var fields = ['comment_content', 'comment_user_id' ];
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'comment_id', 'comment_content']
    }));
    
        Manager.addWidget(new AjaxSolr.HistogramWidget({
      id: 'histogram',
      target: '#histogram',
      fields: ['comment_date', 'comment_hour']
    }));
    
   //************** new widget pyramid pivots ********************
    
     Manager.addWidget(new AjaxSolr.PyramidAges({
      id: 'pyramidAges',
      target: '#pyramidAges',
      field: 'user_sex,user_age',
      'facet.pivot': true
    }));
   // **********************************************************
    
    Manager.addWidget(new AjaxSolr.CalendarWidget({
      id: 'calendar',
      target: '#calendar',
      field: 'comment_date'
    }));
    
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['comment_id', 'comment_order', 'comment_karma', 'comment_randkey', 'comment_date', 'comment_user_id', 'comment_link_id', 'comment_content', 'comment_votes', 'comment_parent', 'comment_hour' ],
      'facet.limit': 20,
      'facet.mincount': 1,
      'f.topics.facet.limit': 50,
      'facet.date': 'comment_date',
      'facet.date.start': '2005-12-01T00:00:00.000Z/DAY',
      'facet.date.end': '2006-12-31T00:00:00.000Z/DAY+1DAY',
      'facet.date.gap': '+1DAY',
      //************** new line for pyramid pivot *******************************
      'facet.pivot':'user_sex,user_age',   	
      'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
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
