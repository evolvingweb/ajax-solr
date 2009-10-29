// $Id$

AjaxSolr.Manager = AjaxSolr.AbstractManager.extend({
  canAddWidget: function (widget) { 
    return widget.target === undefined || jQuery(widget.target) && jQuery(widget.target).length;
  },

  /**
   * @see http://wiki.apache.org/solr/SolJSON#JSON_specific_parameters
   */
  executeRequest: function (queryObj) { 
    var queryString = this.buildQueryString(queryObj);
    var jsonCallback = this.jsonCallback();

    // For debugging purposes
    this.queryStringCache = queryString;

    if (this.passthruUrl) {
      jQuery.post(this.passthruUrl + '?callback=?', { query: queryString }, jsonCallback, 'json');
    }
    else {
      jQuery.getJSON(this.solrUrl + '/select?' + queryString + '&wt=json&json.nl=map&json.wrf=?&jsoncallback=?', {}, jsonCallback);
    }
  }
});
