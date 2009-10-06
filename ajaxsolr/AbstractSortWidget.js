// $Id$

/**
 * Baseclass for all sorting widgets.
 *
 * @class AbstractSortWidget
 * @extends AbstractWidget
 */
AjaxSolr.AbstractSortWidget = AjaxSolr.AbstractWidget.extend({
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
   * @default null
   */
  sort: null,

  alterQuery: function(queryObj) {
    queryObj.sort = this.sort;
  }
});