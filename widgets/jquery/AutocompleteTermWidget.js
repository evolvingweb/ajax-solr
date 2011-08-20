// $Id$

(function ($) {
  
/**
 * A <i>term</i> autocomplete search box, using jQueryUI.autocomplete. This
 * implementation uses Solr's facet.prefix technique. This technique benefits
 * from honoring the filter query state and by being able to put words prior to
 * the last one the user is typing into a filter query as well to get even more
 * relevant completion suggestions.
 *
 * Index instructions: 
 * Put a facet warming query into Solr's "firstSearcher" in solrconfig.xml, for 
 * the target field.
 * Use appropriate text analysis to include a tokenizer (not keyword) and do 
 * <i>not</i> do stemming or else you will see stems suggested. A 'light' 
 * stemmer may produce acceptable stems.
 * If you are auto-completing in a search box that would normally be using
 * the dismax query parser AND your qf parameter references more than one field,
 * then you might want to use a catch-all search field to autocomplete on.
 *
 * For large indexes, another implementation approach like 
 * the Suggester feature or TermsComponent might be better than a faceting
 * approach. 
 *
 * FYI: Other types of autocomplete (AKA suggest) are search-results, query-log, 
 * and facet-value. Again, this one is term autocompletion.
 *
 * @author David Smiley -- david.w.smiley at gmail.com
 */
AjaxSolr.AutocompleteTermWidget = AjaxSolr.AbstractTextWidget.extend({

  /**
   * The Solr field to auto-complete indexed terms from.
   *
   * @field
   * @public
   * @type String
   * @default null
   */
  field: null,
  
  /**
   * Wether the underlying field is tokenized. This component will take words
   * before the last word (whitespace separated) and generate a filter query
   * for those words, while only the last word will be used for facet.prefix.
   * For field-value completion (on just one field) or query log completion, 
   * you would have a non-tokenized field to complete against.
   * 
   * @field
   * @public
   * @type Boolean
   * @default true
   */ 
  tokenized: true,
  
  /**
   * Indicates wether to lowercase the facet.prefix value.
   *
   * @field
   * @public
   * @type Boolean
   * @default true
   */
  lowercase: true,
  
  /**
   * The maximum number of results to show.
   *
   * @field
   * @public
   * @type Number
   * @default 10
   */
  limit: 10,
  
  /**
   * The minimum number of characters required to show suggestions.
   *
   * @field
   * @public
   * @type Number
   * @default 2
   */
  minLength: 2,
  
  /**
   * The URL path that follows the solr webapp, for use in auto-complete
   * queries. 
   * If not specified, the manager's servlet property will be used.
   * You may prepend the servlet with a core if using multiple cores.
   * It is a good idea to use a non-default one to differentiate these requests
   * in server logs and Solr statistics.
   *
   * @field
   * @public
   * @type String
   * @default null
   */
  servlet: null,
  
  init: function () {
    var self = this;
    
    if (! self.field)
      throw '"field" must be set on AutocompleteTermWidget.';
    self.servlet = (self.servlet || self.manager.servlet);

    $(this.target).find('input').bind('keydown', function(e) {
      if (e.which == 13) {
        var q = $(this).val();
        if (self.set(q)) {
          self.manager.doRequest(0);
        }
      }
    });
    
    //as suggested by jpmckinney
    function executeRequest_jquery_enhanced (servlet, string, handler) {
      var self = this;      
      string = string || self.store.string();
      handler = handler || function (data) { self.handleResponse(data); };
      if (self.proxyUrl) {
        jQuery.post(this.proxyUrl, { query: string }, handler, 'json');
      }
      else {
        jQuery.getJSON(this.solrUrl + servlet + '?' + string + '&wt=json&json.wrf=?', {}, handler);
      }
    };
    
    function autocomplete_source ( request, response ) {
      //Note: must always call response()
      var qInput = request.term;
      if (qInput.charAt(qInput.length-1).trim() == '') {//ends with a space
        response();
        return;
      }
      var qPrefix = qInput;//facet.prefix value
      var qFilter = "";//before the last word (if we tokenize)
      var store = new AjaxSolr.ParameterStore();
      store.addByValue('fq',self.manager.store.values('fq'));
      
      if (self.tokenized) {
        //-- take the query string and split out the last word from the words
        // before it.
        var lastSpace = qInput.lastIndexOf(' ');
        if (lastSpace > -1) {
          qFilter = qInput.substring(0,lastSpace);
          qPrefix = qInput.substring(lastSpace+1);
          store.addByValue('fq','{!dismax qf='+self.field+'}'+qFilter);
        }
      }
      if (self.lowercase)
        qPrefix = qPrefix.toLowerCase();
      
      store.addByValue('facet.field',self.field);
      store.addByValue('facet.prefix',qPrefix);
      store.addByValue('facet.limit',self.limit);
      var urlParams = 'json.nl=arrarr&q=*:*&rows=0&facet=true&facet.mincount=1&' + store.string();
      
      function ajaxhandler ( data ) {
        var rspData = $.map( data.facet_counts.facet_fields[self.field], function( term ) {
          var q = (qFilter + " " + term[0]).trim();
          return {
            label: q + " (" + term[1] + ")",
            value: q,
          }
        });
        response( rspData );
      };

      executeRequest_jquery_enhanced.apply(self.manager,
        [self.servlet, urlParams, ajaxhandler ]);
    };//autocomplete_source
    
    $(this.target).find('input').autocomplete({
      source: autocomplete_source,
      minLength: self.minLength,
      select: function( event, ui ) {
        if (self.set(ui.item.value)) {
          self.manager.doRequest(0);
        }      
      },
    });

  },//init()

});

})(jQuery);
