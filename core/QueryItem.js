// $Id$

/**
 * Represents a Solr query.
 *
 * @param properties A map of fields to set. Refer to the list of public fields.
 * @class QueryItem
 */
AjaxSolr.QueryItem = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.QueryItem.prototype */
  {
  /**
   * The value.
   *
   * @field
   * @public
   * @type String
   */
  value: null,

  /**
   * Transforms this item into Solr syntax.
   *
   * @returns {String} Solr Query syntax.
   */
  toSolr: function () {
    return encodeURIComponent(this.value);
  },

  /**
   * Prepares this item for inclusion in the URL hash.
   *
   * @returns {String} A key-value pair for the URL hash.
   */
  toHash: function () {
    return encodeURIComponent(this.value);
  },

  /**
   * Parses a key-value pair from the URL hash.
   *
   * @param {String} string A key-value pair from the URL hash.
   */
  parseHash: function (string) {
    this.value = decodeURIComponent(string);
  }
});
