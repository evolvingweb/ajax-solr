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

  buildQuery: function (queryObj) {
    queryObj.sort = this.sort;
  }
});