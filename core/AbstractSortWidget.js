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

  // Implementations/definitions of abstract methods.

  buildQuery: function (queryObj) {
    queryObj.sort = this.sort;
  },

  loadFromHash: function (first, pairs) {
    for (var i = 0, length = pairs.length; i < length; i++) {
      if (pairs[i].startsWith(this.id + '=')) {
        this.sort = decodeURIComponent(pairs[i].substring(this.id.length + 1));
      }
    }
  },

  addToHash: function (queryObj) {
    if (queryObj.sort) {
      return this.id + '=' + encodeURIComponent(queryObj.sort);
    }
  }
});