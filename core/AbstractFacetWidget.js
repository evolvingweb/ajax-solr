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
   * Whether to collect facet values. Useful if you will be using filters but
   * not be displaying facet values.
   *
   * @field
   * @public
   * @type Boolean
   */
  facet: true,

  /**
   * facet.limit parameter.
   *
   * @field
   * @public
   * @type Number
   * @default 20
   */
  limit: 20,

  /**
   * Initial number of facet values to display.
   *
   * @field
   * @public
   * @type Number
   * @default 10
   */
  initialLimit: 10,

  /**
   * facet.missing parameter.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  missing: false,

  /**
   * Whether to always return documents that do not have this field set.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  orNull: false,

  /**
   * Facet operator.
   *
   * @field
   * @public
   * @type String
   * @default "AND"
   */
  operator: 'AND',

  /**
   * Whether its filter queries should be excluded in the facet count.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  exclude: false,

  /**
   * Whether the facet values are publicly viewable.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  hidden: false,

  /**
   * A flag that indicates whether new selected items should replace old ones.
   *
   * @field
   * @private
   * @type Boolean
   * @default false
   */
  replace: false,

  /**
   * The list of selected items (filters).
   *
   * @field
   * @private
   * @type Array
   * @default []
   */
  selectedItems: [],

  /**
   * Facet fields returned by Solr.
   *
   * @field
   * @private
   */
  facetFields: null,

  /**
   * Facet dates returned by Solr.
   *
   * @field
   * @private
   */
  facetDates: null,

  /**
   * Add the given items to the list of selected items.
   *
   * @param {Array} items The items to add.
   * @returns {Boolean} Whether the selection changed.
   */
  selectItems: function (items) {
    if (this.replace) {
      this.clear();
    }

    return this.changeSelection(function () {
      for (var i = 0, length = items.length; i < length; i++) {
        if (AjaxSolr.inArray(items[i], this.selectedItems) == -1) {
          this.selectedItems.push(items[i]);
        }
      }
    });
  },

  /**
   * Removes the given items from the list of selected items.
   *
   * @param {Array} items The items to remove.
   * @returns {Boolean} Whether the selection changed.
   */
  deselectItems: function (items) {
    return this.changeSelection(function () {
      for (var i = 0, length = items.length; i < length; i++) {
        for (var j = this.selectedItems.length - 1; j >= 0; j--) {
          if (this.selectedItems[j] == items[i]) {
            this.selectedItems.splice(j, 1);
          }
        }
      }
    });
  },

  /**
   * Removes all items from the current selection.
   *
   * @returns {Boolean} Whether the selection changed.
   */
  clear: function () {
    return this.changeSelection(function () {
      this.selectedItems = [];
    });
  },

  /**
   * Helper for selection functions.
   *
   * @param {Function} Selection function to call.
   * @returns {Boolean} Whether the selection changed.
   */
  changeSelection: function (func) {
    var start = this.selectedItems.length;
    func.apply(this);
    if (this.selectedItems.length !== start) {
      this.afterChangeSelection();
    }
    return this.selectedItems.length !== start;
  },

  /**
   * An abstract hook for child implementations.
   * This method is executed after items are selected or deselected.
   */
  afterChangeSelection: function () {},

  alterQuery: function (queryObj) {
    if (this.facet) {
      queryObj.fields.push({
        field: this.field,
        limit: this.limit,
        missing: this.missing
      });
    }
    queryObj.fq = queryObj.fq.concat(this.getItems());
  },

  handleResult: function (data) {
    if (data.facet_counts) {
      this.facetFields = data.facet_counts.facet_fields[this.field];
      this.facetDates = data.facet_counts.facet_dates[this.field];
      this._handleResult();
    }
  },

  /**
   * An abstract hook for child implementations.
   * Allow the child to handle the result without parsing the response.
   */
  _handleResult: function () {},

  /**
   * Returns all the selected items as filter query items.
   *
   * @returns {FilterQueryItem[]}
   */
  getItems: function () {
    var items = [];
    for (var i = 0, length = this.selectedItems.length; i < length; i++) {
      items.push(new AjaxSolr.FilterQueryItem({
        field: this.field,
        value: this.selectedItems[i],
        hidden: this.hidden,
        widgetId: this.id
      }));
    }
    return items;
  },

  /**
   * Returns a function to deselect the given value.
   *
   * @param value The given value.
   * @returns {Function}
   */
  unclickHandler: function (value) {
    var me = this;
    return function () {
      if (me.deselectItems([ value ])) {
        me.manager.doRequest(0);
      }
      return false;
    }
  },

  /**
   * Returns a function to select the given value.
   *
   * @param value The given value.
   * @returns {Function}
   */
  clickHandler: function (value) {
    var me = this;
    return function () {
      if (me.selectItems([ value ])) {
        me.manager.doRequest(0);
      }
      return false;
    }
  },

  /**
   * Returns a string representation of the value to deselect.
   *
   * @param value The value to deselect.
   * @returns {String}
   */
  unclickText: function (value) {
    return value;
  },

  /**
   * Returns a string representation of the value to select.
   *
   * @param value The value to select.
   * @returns {String}
   */
  clickText: function (value) {
    return value;
  }
});
