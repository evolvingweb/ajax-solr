// $Id$

(function ($) {
  
/**
 * A <i>term</i> autocomplete search box, using jQueryUI.autocomplete. This
 * implementation uses Solr's facet.prefix technique. This technique benefits
 * from honoring the filter query state and by being able to put words prior to
 * the last one the user is typing into a filter query as well to get even more
 * relevant completion suggestions. Remember to put a facet warming query into 
 * Solr's "firstSearcher" in solrconfig.xml, for the target field.  Remember to
 * use appropriate text analysis to include a tokenizer (not keyword) and do 
 * <i>not</i> do stemming or else you will see stems suggested. A 'light' 
 * stemmer may produce acceptable stems.
 *
 * For large indexes, another implementation approach like 
 * the Suggester feature or TermsComponent might be better than a faceting
 * approach. 
 *
 * FYI: Other types of autocomplete are search-results, query-log, and 
 * facet-value. Again, this one is term-completion.
 *
 * @author David Smiley -- david.w.smiley at gmail.com
 */
AjaxSolr.AutocompleteTermWidget = AjaxSolr.AbstractTextWidget.extend({
  /*
TODO: 
# Use the manager for executing the query, so that things like the proxyUrl are considered. However the "store" should be different
 for this request. Maybe we extend a manager and have a kind of manager proxy with a different store, using javascript tricks? Or suggest
 changes to Ajax-Solr's manager to have a per-request store override.
  */
  
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
   * The maximum number of results to show.
   *
   * @field
   * @public
   * @type Number
   * @default 10
   */
  limit: 10,
  
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
    
    $(this.target).find('input').autocomplete({
      source: function( request, response ) {
        
        var params = {};
        //-- take the query string and split out the last word from the words
        // before it.
        var qInput = $(self.target).find('input').val().trim();
        var qFilter = "";//before the last word
        var qPrefix = qInput;//the last word
        var lastSpace = qInput.lastIndexOf(' ');
        if (lastSpace > -1) {
          qFilter = qInput.substring(0,lastSpace);
          qPrefix = qInput.substring(lastSpace+1);
          params['fq'] = self.field + ':' + AjaxSolr.Parameter.escapeValue(qFilter);//this phrases it,
        }
        qPrefix = qPrefix.toLowerCase();
        
        //get filter queries in effect now
        var fqsUrl = '';
        var storeParamsFq = self.manager.store.params['fq'];
        if (storeParamsFq !== undefined) {
          for (var i = 0, l = storeParamsFq.length; i < l; i++) {
            fqsUrl += '&'+storeParamsFq[i].string();
          }
        }
        
        params['facet.field'] = self.field;
        params['facet.prefix'] = qPrefix;
        var defParamsUrl = 'wt=json&json.nl=arrarr&json.wrf=?&q=*:*&rows=0&facet=true&facet.mincount=1&facet.limit='+self.limit;
        //TODO find way to use manager.doRequest
        $.ajax({
          url: self.manager.solrUrl + self.servlet + '?'+defParamsUrl+fqsUrl,
          dataType: "jsonp",
          data: params,
          success: function( data ) {
            response( $.map( data.facet_counts.facet_fields[self.field], function( term ) {
              var q = (qFilter ? qFilter + " " : "") + term[0];
              return {
                label: q + " (" + term[1] + ")",
                value: q,
              }
            }));
          }
        });
      },
      minLength: 2,
      select: function( event, ui ) {
        if (self.set(ui.item.value)) {
          self.manager.doRequest(0);
        }      
      },
    });

  },

});

})(jQuery);
