// $Id$

/**
 * URL-encodes a string.
 *
 * @param skip Whether to skip encoding.
 */
String.prototype.urlencode = function(skip) {
  if (skip) {
    return this;
  }
  else {
    return encodeURIComponent(this);
  }
}

/**
 * Strip whitespace from the beginning and end of a string.
 */
String.prototype.trim = function() {
  return this.replace(/^ +/, '').replace(/ +$/, '');
}

/**
 * Returns a date in ISO8601 format.
 */
String.prototype.toDate = function() {
  return new Date().setISO8601(this);
}

/**
 * Returns the given date part as a formatted string.
 *
 * @param part The given date part.
 */
Date.prototype.datePartString = function(part) {
  return jQuery.strftime(AjaxSolr.dateFormats.datePartFormats[part.toUpperCase()], this, true);
}

/**
 * Returns a date in long-format according to the given level of granularity.
 *
 * @param granularity The given level of granularity.
 */
Date.prototype.toLongDateString = function(granularity) {
  return jQuery.strftime(AjaxSolr.dateFormats.longDateFormats[granularity.toUpperCase()], this, true);
}

/**
 * @see http://dansnetwork.com/2008/11/01/javascript-iso8601rfc3339-date-parser/ 
 */
Date.prototype.setISO8601 = function(dString) {
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
}
