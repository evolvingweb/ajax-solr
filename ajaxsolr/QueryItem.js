// $Id$

/**
 * Represents a Solr Query.
 */
AjaxSolr.QueryItem = AjaxSolr.Class.extend({
  /**
   * The value of the item.
   *
   * @field
   * @public
   */
  value: '',

  /**
   * The widget that manages this item.
   *
   * @field
   * @public
   */
  widgetId: null,

  /**
   * Transforms this item into Solr syntax.
   *
   * @param skip Whether to skip encoding the value.
   * @return Solr Query syntax.
   */
  toSolr: function(skip) {
    return this.value.urlencode(skip);
  },

  /**
   * Prepares this item for inclusion in the URL hash.
   *
   * @param skip Whether to skip encoding the value.
   * @return A key-value pair for the URL hash.
   */
  toHash: function() {
    return this.value.urlencode();
  },

  /**
   * Parses a key-value pair from the URL hash.
   *
   * @param A key-value pair from the URL hash.
   */
  parseHash: function(string) {
    this.value = decodeURIComponent(string);
  }
});
