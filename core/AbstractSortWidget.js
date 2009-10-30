// $Id$

/**
 * Baseclass for all sorting widgets.
 *
 * @class AbstractSortWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractSortWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstractSortWidget.prototype */
  {
  /**
   * A list of available sort fields.
   *
   * @field
   * @public
   * @default {}
   */
  sorts: {},

  /**
   * Store the current sort field.
   *
   * @field
   * @private
   */
  sort: null,

  loadFromHash: function (first, pairs) {
    for (var i = 0, length = pairs.length; i < length; i++) {
      if (pairs[i].startsWith('sort=')) {
        this.sort = decodeURIComponent(pairs[i].substring(5));
      }
    }
  },

  addToHash: function (queryObj) {
    if (queryObj.sort) {
      return 'sort=' + encodeURIComponent(queryObj.sort);
    }
  },

  buildQuery: function (queryObj) {
    queryObj.sort = this.sort;
  }
});