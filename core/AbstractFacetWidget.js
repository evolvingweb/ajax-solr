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
   * @returns {Boolean} Whether any filter queries have been set using this
   *   widget's facet field.
   */
  isEmpty: function () {
    return !this.manager.store.find('fq', new RegExp('^-?' + this.field + ':'));
  },

  /**
   * Adds a filter query.
   *
   * @returns {Boolean} Whether a filter query was added.
   */
  add: function (value) {
    return this.changeSelection(function () {
      return this.manager.store.add('fq', new AjaxSolr.Parameter({ name: 'fq', value: this.fq(value) }));
    });
  },

  /**
   * Removes a filter query.
   *
   * @returns {Boolean} Whether a filter query was removed.
   */
  remove: function (value) {
    return this.changeSelection(function () {
      return this.manager.store.deleteByValue('fq', this.fq(value));
    });
  },

  /**
   * Removes all filter queries using the widget's facet field.
   *
   * @returns {Boolean} Whether a filter query was removed.
   */
  clear: function () {
    return this.changeSelection(function () {
      return this.manager.store.deleteByValue('fq', new RegExp('^-?' + this.field + ':'));
    });
  },

  /**
   * Helper for selection functions.
   *
   * @param {Function} Selection function to call.
   * @returns {Boolean} Whether the selection changed.
   */
  changeSelection: function (func) {
    changed = func.apply(this);
    if (changed) {
      this.afterChangeSelection();
    }
    return changed;
  },

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method is executed after the filter queries change.</p>
   */
  afterChangeSelection: function () {},

  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully adds a
   *   filter query with the given value.
   */
  clickHandler: function (value) {
    var me = this;
    return function () {
      if (me.add(value)) {
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
      if (me.remove(value)) {
        me.manager.doRequest(0);
      }
      return false;
    }
  },

  /**
   * @param {String} value The facet value.
   * @param {Boolean} exclude Whether to exclude this fq parameter value.
   * @returns {String} An fq parameter value.
   */
  fq: function (value, exclude) {
    // If the field value has a space or a colon in it, wrap it in quotes,
    // unless it is a range query.
    if (value.match(/[ :]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/)) {
      value = '"' + value + '"';
    }
    return (exclude ? '-' : '') + this.field + ':' + encodeURIComponent(value);
  }
});
