// $Id$

AjaxSolr.AbstractSortWidget = AjaxSolr.AbstractWidget.extend({
  /**
   * A list of available sort fields.
   *
   * @field
   * @public
   */
  sorts: {},

  /**
   * Store the current sort field.
   *
   * @field
   * @private
   */
  sort: '',

  alterQuery: function(queryObj) {
    queryObj.sort = this.sort;
  }
});