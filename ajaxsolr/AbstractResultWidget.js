// $Id$

AjaxSolr.AbstractResultWidget = AjaxSolr.AbstractWidget.extend({
  /**
   * The set of fields to return.
   *
   * @field
   * @public
   */
  fields: [],

  /**
   * The number of fields to return.
   *
   * @field
   * @public
   */
  rows: 0,

  alterQuery: function(queryObj) {
    queryObj.fl = queryObj.fl.concat(this.fields);
    if (this.rows > queryObj.rows) {
      queryObj.rows = this.rows;
    }
  }
});
