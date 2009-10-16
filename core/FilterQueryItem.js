// $Id$

/**
 * Represents a Solr filter query.
 *
 * @param properties A map of fields to set. Refer to the list of public fields.
 * @class FilterQueryItem
 */
AjaxSolr.FilterQueryItem = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.FilterQueryItem.prototype */
  {
  /**
   * The field name.
   *
   * @field
   * @public
   * @type String
   */
  field: null,

  /**
   * The value.
   *
   * @field
   * @public
   * @type String
   */
  value: null,

  /**
   * Attach the prohibit operator.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  exclude: false,

  /**
   * Whether the value is publicly viewable.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  hidden: false,

  /**
   * The widget that manages this item.
   *
   * @field
   * @public
   * @type String
   */
  widgetId: null,

  /**
   * Transforms this item into Solr syntax.
   *
   * @returns {String} Solr Filter Query syntax.
   */
  toSolr: function () {
    // If the field value has a space or a colon in it, wrap it in quotes,
    // unless it is a range query.
    var value;
    if (this.value.match(/[ :]/) && !this.value.match(/[\[\{]\S+ TO \S+[\]\}]/)) {
      value = '"' + this.value + '"';
    } else {
      value = this.value;
    }
    return (this.exclude ? '-' : '') + this.field + ':' + encodeURIComponent(value);
  },

  /**
   * Transforms this item into Solr syntax (not URL-encoded).
   *
   * @returns {String} Solr Filter Query syntax.
   */
  toString: function () {
    return (this.exclude ? '-' : '') + this.field + ':' + this.value;
  },

  /**
   * Prepares this item for inclusion in the URL hash.
   *
   * @returns {String} A key-value pair for the URL hash.
   */
  toHash: function () {
    return (this.exclude ? '-' : '') + this.widgetId + ':' + encodeURIComponent(this.value);
  },

  /**
   * Parses a key-value pair from the URL hash. The value may be a quoted
   * string, an unquoted string, or a range.
   *
   * @param {String} string A key-value pair from the URL hash.
   */
  parseHash: function (string) {
    var matches = string.match(/(-?)([^:]+):(.*)/);
    if (matches) {
      this.exclude = matches[1] == '-';
      this.widgetId = matches[2];
      this.value = matches[3];
    }
  }
});

/**
 * Parses a value, whether it is a quoted string, unquoted string, or range.
 *
 * @static
 * @param {String} The value to parse.
 * @returns The parsed value object.
 */
AjaxSolr.FilterQueryItem.parseValue = function (value) {
  if (matches = value.match(/[\[\{](\S+) TO (\S+)[\]\}]/)) {
    return { value: matches[0], start: matches[1], end: matches[2] };
  }
  else {
    return { value: value };
  }
};
