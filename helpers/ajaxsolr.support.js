// $Id$

/**
 * Strip whitespace from the beginning and end of a string.
 *
 * @returns {String} The trimmed string.
 */
String.prototype.trim = function () {
  return this.replace(/^ +/, '').replace(/ +$/, '');
};

/**
 * A utility method for escaping HTML tag characters.
 * <p>From Ruby on Rails.</p>
 *
 * @returns {String} The escaped string.
 */
String.prototype.htmlEscape = function () {
  return this.replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/&/g, '&amp;');
};

/**
 * Escapes the string without affecting existing escaped entities.
 * <p>From Ruby on Rails.</p>
 *
 * @returns {String} The escaped string
 */
String.prototype.escapeOnce = function () {
  return this.replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/&(?!([a-zA-Z]+|#\d+);)/g, '&amp;');
};

/**
 * <p>From Ruby on Rails.</p>
 *
 * @see http://www.w3.org/TR/html4/types.html#type-name
 */
String.prototype.sanitizeToId = function () {
  return this.replace(/\]/g, '').replace(/[^-a-zA-Z0-9:.]/g, '_');
};

/**
 * Does the string end with the specified <tt>suffix</tt>?
 * <p>From Ruby on Rails.</p>
 *
 * @param {String} suffix The specified suffix.
 * @returns {Boolean}
 */
String.prototype.endsWith = function (suffix) {
  return this.substring(this.length - suffix.length) == suffix;
};

/**
 * Does the string start with the specified <tt>prefix</tt>?
 * <p>From Ruby on Rails.</p>
 *
 * @param {String} prefix The speficied prefix.
 * @returns {Boolean}
 */
String.prototype.startsWith = function (prefix) {
  return this.substring(0, prefix.length) == prefix;
};

/**
 * Equivalent to PHP's two-argument version of strtr.
 *
 * @see http://php.net/manual/en/function.strtr.php
 * @param {Object} replacePairs An associative array in the form: {'from': 'to'}
 * @returns {String} A translated copy of the string.
 */
String.prototype.strtr = function (replacePairs) {
  var str = this;
  for (var from in replacePairs) {
    str = str.replace(new RegExp(from, 'g'), replacePairs[from]);
  }
  return str;
};

/**
 * Returns a date in ISO8601 format.
 *
 * @returns {Date} The date in ISO8601 format.
 */
String.prototype.toDate = function () {
  return new Date().setISO8601(this);
};

/**
 * Returns a string representation of the given level of granularity, in the
 * context of the date.
 *
 * @param {String} granularity The given level of granularity.
 * @returns {String} The string representation of the level of granularity.
 */
Date.prototype.datePartString = function (granularity) {
  return jQuery.strftime(AjaxSolr.dateFormats.datePartFormats[granularity.toUpperCase()], this, true);
};

/**
 * Returns a string representation of the date, truncated to the given level of
 * granularity.
 *
 * @param {String} granularity The given level of granularity.
 * @returns {String} The string representation of the date.
 */
Date.prototype.toLongDateString = function (granularity) {
  return jQuery.strftime(AjaxSolr.dateFormats.longDateFormats[granularity.toUpperCase()], this, true);
};

/**
 * @see http://dansnetwork.com/2008/11/01/javascript-iso8601rfc3339-date-parser/ 
 */
Date.prototype.setISO8601 = function (dString) {
  var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;

  if (dString.toString().match(new RegExp(regexp))) {
    var d = dString.match(new RegExp(regexp));
    var offset = 0;

    this.setUTCDate(1);
    this.setUTCFullYear(parseInt(d[1], 10));
    this.setUTCMonth(parseInt(d[3], 10) - 1);
    this.setUTCDate(parseInt(d[5], 10));
    this.setUTCHours(parseInt(d[7], 10));
    this.setUTCMinutes(parseInt(d[9], 10));
    this.setUTCSeconds(parseInt(d[11], 10));
    if (d[12]) {
      this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    }
    else {
      this.setUTCMilliseconds(0);
    }
    if (d[13] != 'Z') {
      offset = (d[15] * 60) + parseInt(d[17], 10);
      offset *= ((d[14] == '-') ? -1 : 1);
      this.setTime(this.getTime() - offset * 60 * 1000);
    }
  }
  else {
    this.setTime(Date.parse(dString));
  }
  return this;
};
