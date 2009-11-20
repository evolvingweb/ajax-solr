// $Id$

/**
 * Baseclass for all facet widgets.
 *
 * @class AbstractFacetWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractFacetWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstractFacetWidget.prototype */
  {
  /**
   * The field to facet on.
   *
   * @field
   * @public
   * @type String
   */
  field: null,

  /**
   * Removes all filter queries using the widget's facet field.
   *
   * @returns {Boolean} Whether any filter queries were removed.
   */
  clear: function () {
    return this.manager.store.deleteByValue('fq', new RegExp('^-?' + this.field + ':'));
  },

  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully adds a
   *   filter query with the given value.
   */
  clickHandler: function (value) {
    var me = this;
    return function () {
      var param = new AjaxSolr.Parameter({ name: 'fq', value: me.fq(me.field, value) });
      if (me.manager.store.add('fq', param) {
        me.manager.doRequest(0);
      }
      return false;
    }
  },

  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully removes a
   *   filter query with the given value.
   */
  unclickHandler: function (value) {
    var me = this;
    return function () {
      if (me.manager.store.deleteByValue('fq', me.fq(me.field, value))) {
        me.manager.doRequest(0);
      }
      return false;
    }
  },

  /**
   * @param {String} field The facet field.
   * @param {String} value The facet value.
   * @param {Boolean} exclude Whether to exclude this fq parameter value.
   * @returns {String} An fq parameter value.
   */
  fq: function (field, value, exclude) {
    // If the field value has a space or a colon in it, wrap it in quotes,
    // unless it is a range query.
    if (value.match(/[ :]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/)) {
      value = '"' + value + '"';
    }
    return (exclude ? '-' : '') + field + ':' + encodeURIComponent(value);
  }
});
