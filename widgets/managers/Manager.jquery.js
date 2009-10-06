// $Id$

AjaxSolr.Manager = AjaxSolr.AbstractManager.extend({
  canAddWidget: function(widget) { 
    return widget.target === undefined || jQuery(widget.target) && jQuery(widget.target).length;
  },

  /**
   * @see http://wiki.apache.org/solr/SolJSON#JSON_specific_parameters
   */
  executeRequest: function(queryObj) { 
    var me = this;
    if (this.passthruUrl == '') {
      jQuery.getJSON(this.solrUrl + '/select?' + this.buildQueryString(queryObj) + '&wt=json&json.nl=map&json.wrf=?&jsoncallback=?', {}, this.jsonCallback());
    }
    else {
      jQuery.post(this.passthruUrl + '?callback=?', { query: this.buildQueryString(queryObj, true) }, this.jsonCallback(), 'json');
    }
  }
});
