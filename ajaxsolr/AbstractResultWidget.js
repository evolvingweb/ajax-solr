// $Id$

/**
 * Baseclass for all result widgets.
 *
 * @class AbstractResultWidget
 * @extends AbstractWidget
 */
AjaxSolr.AbstractResultWidget = AjaxSolr.AbstractWidget.extend({
  /**
   * The set of fields to return.
   *
   * @field
   * @public
   * @default []
   */
  fields: [],

  /**
   * The number of fields to return.
   *
   * @field
   * @public
   * @default 0
   */
  rows: 0,

  alterQuery: function(queryObj) {
    queryObj.fl = queryObj.fl.concat(this.fields);
    if (this.rows > queryObj.rows) {
      queryObj.rows = this.rows;
    }
  }
});
