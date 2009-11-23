// $Id$

/**
 * @see http://wiki.apache.org/solr/SolJSON#JSON_specific_parameters
 */
AjaxSolr.Manager = AjaxSolr.AbstractManager.extend({
  executeRequest: function () {
    if (this.proxyUrl) {
      jQuery.post(this.proxyUrl + '?callback=?', { query: this.store.toString() }, this.callback, 'json');
    }
    else {
      jQuery.getJSON(this.solrUrl + '?' + this.store.toString() + '&wt=json&json.wrf=?&jsoncallback=?', {}, this.callback);
    }
  },

  callback: function (data) {
    this.handleResponse(data);
  }
});
