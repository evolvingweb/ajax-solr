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

    // For debugging purposes
    this.queryStringCache = queryString;

    var me = this;
    if (this.passthruUrl) {
      jQuery.post(this.passthruUrl + '?callback=?', { query: queryString }, this.jsonCallback(), 'json');
    }
    else {
      jQuery.getJSON(this.solrUrl + '/select?' + queryString + '&wt=json&json.nl=map&json.wrf=?&jsoncallback=?', {}, this.jsonCallback());
    }
  }
});
