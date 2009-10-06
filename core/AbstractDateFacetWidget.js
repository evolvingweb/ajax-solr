// $Id$

/**
 * Defines some date formats in strftime format.
 *
 * @field
 * @private
 */
AjaxSolr.dateFormats = {
  /**
   * strftime()-compatible format for each date part.
   *
   * @field
   * @private
   */
  datePartFormats: {
    'YEAR'   : '%Y',
    'MONTH'  : '%B %Y',
    'DAY'    : '%B %e, %Y',
    'HOUR'   : '%l %p',
    'MINUTE' : '%l:%M %p',
    'SECOND' : '%l:%M:%S %p'
  },

  /**
   * strftime()-compatible format for each level of granularity.
   *
   * @field
   * @private
   */
  longDateFormats: {
    'YEAR'   : '%Y',
    'MONTH'  : '%B %Y',
    'DAY'    : '%B %e, %Y',
    'HOUR'   : '%l %p, %B %e, %Y',
    'MINUTE' : '%l:%M %p, %B %e, %Y',
    'SECOND' : '%l:%M:%S %p, %B %e, %Y'
  }
}

/**
 * Baseclass for all date facet widgets.
 *
 * @class AbstractDateFacetWidget
 * @augments AjaxSolr.AbstractFacetWidget
 */
AjaxSolr.AbstractDateFacetWidget = AjaxSolr.AbstractFacetWidget.extend(
  /** @lends AjaxSolr.AbstractDateFacetWidget.prototype */
  {
  replace: true,

  /**
   * Earliest date selectable.
   *
   * @field
   * @public
   * @type String
   */
  minDate: null,

  /**
   * Latest date selectable.
   *
   * @field
   * @public
   * @type String
   */
  maxDate: null,

  /**
   * Allow users to drill down to this level of granularity.
   *
   * @field
   * @public
   * @type String
   * @default "MINUTE"
   */
  granularity: 'MINUTE',

  /**
   * The list of date parts, used to determine the next or previous date part.
   *
   * @static
   * @private
   */
  parts: [
    'YEAR',
    'MONTH',
    'DAY',
    'HOUR',
    'MINUTE',
    'SECOND',
    'MILLISECOND'
  ],

  /**
   * Stop-index for each date part, when appearing in a date in ISO 8601 format.
   *
   * @static
   * @private
   */
  indices: {
    'YEAR'   : 4,
    'MONTH'  : 7,
    'DAY'    : 10,
    'HOUR'   : 13,
    'MINUTE' : 16,
    'SECOND' : 19
  },

  alterQuery: function(queryObj) {
    if (this.selectedItems.length) {
      var gap = this.selectedItems[0][1].split('+1')[1];

      queryObj.dates.push({
        field: this.fieldName,
        start: this.selectedItems[0][0] + '/' + gap,
        end:   this.selectedItems[0][1] + '/' + gap,
        gap:   '+1' + this.parts[this.indexOfPart(gap) + 1]
      });
    }
    else {
      queryObj.dates.push({
        field: this.fieldName,
        start: this.minDate + '/YEAR',
        end:   this.maxDate + '+1YEAR/YEAR',
        gap:   '+1YEAR'
      });
    }
    queryObj.fq = queryObj.fq.concat(this.getItems());
  },

  unclickHandler: function(value, gap) {
    var me = this;

    // if called from outside this class, gap will not be set
    if (gap === undefined) {
      gap = value[1].split('+1')[1];
    }

    // deselecting a date selects the previous level of granularity
    gap = this.parts[this.indexOfPart(gap) - 1];

    return function() {
      if (gap) {
        me.manager.selectItems(me.id, [ me.getValue(value[0], gap) ]);
      }
      else {
        me.manager.deselectWidget(me.id);
      }
      return false;
    }
  },

  unclickText: function(value) {
    return value[0].toDate().toLongDateString(value[1].split('+1')[1]);
  },

  clickText: function(value) {
    return value[0].toDate().datePartString(this.facetDates.gap.substring(2));
  },

  /**
   * Given a date and a granularity, returns a data range in which the dates
   * are in ISO8601 format truncated to the given level of granularity.
   *
   * @param {String} date The date.
   * @param {String} granularity The granularity.
   * @returns {String[]} The date range.
   */
  getValue: function(date, granularity) {
    index = this.indices[granularity];
    date = date.substring(0, index) + '0000-01-01T00:00:00Z'.substring(index);
    return [ date, date + '+1' + granularity ];
  },

  /**
   * Array.indexOf() is undefined in IE, but rather than define it globally,
   * I just write this one function for the one case in which I need it.
   *
   * @param {String} part The date part to search for.
   * @returns {Number} If found, the index of the date part; -1, otherwise.
   */
  indexOfPart: function(part) {
    for (var i = 0; i < this.parts.length; i++) {
      if(this.parts[i] == part) {
        return i;
      }
    }
    return -1;
  }
});
