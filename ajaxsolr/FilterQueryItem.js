// $Id$

/**
 * Represents a Solr Filter Query.
 */
AjaxSolr.FilterQueryItem = AjaxSolr.Class.extend({
  /**
   * The name of the item.
   *
   * @field
   * @public
   */
  field: '',

  /**
   * The value of the item.
   *
   * @field
   * @public
   */
  value: '',

  /**
   * Whether the value is publicly viewable.
   *
   * @field
   * @public
   */
  hidden: false,

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
   * @return Solr Filter Query syntax.
   */
  toSolr: function(skip) {
    return this.field + ':' + this.getValue().urlencode(skip);
  },

  /**
   * Prepares this item for inclusion in the URL hash.
   *
   * @param skip Whether to skip encoding the value.
   * @return A key-value pair for the URL hash.
   */
  toHash: function() {
    return this.widgetId + ':' + this.getValue().urlencode();
  },

  /**
   * Parses a key-value pair from the URL hash.
   *
   * @param A key-value pair from the URL hash.
   */
  parseHash: function(string) {
    var parts = string.split(':');
    this.widgetId = parts[0];
    this.value = decodeURIComponent(parts.slice(1, parts.length).join(':'));
    this.value = this.value.substring(1, this.value.length - 1);

    // handle multiple values
    var values = this.value.split(' TO ');
    if (values.length == 2) {
      this.value = values;
    }
  },

  /**
   * Flattens the value into a quoted string.
   *
   * @return A quoted string.
   */
  getValue: function() {
    if (this.value.constructor == Array && this.value.length == 2) {
      return '[' + this.value[0] + ' TO ' + this.value[1] + ']';
    } else {
      return '"' + this.value + '"';
    }
  }
});
