// $Id$

/**
 * Baseclass for all facet widgets.
 *
 * @class AbstractFacetWidget
 * @extends AbstractWidget
 */
AjaxSolr.AbstractFacetWidget = AjaxSolr.AbstractWidget.extend({
  /**
   * The field to facet on.
   *
   * @field
   * @public
   * @type String
   * @default null
   */
  fieldName: null,

  /**
   * This field contains the human-readable versions of the values stored in
   * the field fieldName.
   *
   * @field
   * @public
   * @type String
   * @default null
   */
  humanFieldName: null,

  /**
   * Maximum number of facet values to display.
   *
   * @field
   * @public
   * @type Number
   * @default null
   */
  limit: null,

  /**
   * Facet fields returned by Solr.
   *
   * @field
   * @private
   * @default null
   */
  facetFields: null,

  /**
   * Facet dates returned by Solr.
   *
   * @field
   * @private
   * @default null
   */
  facetDates: null,

  alterQuery: function(queryObj) {
    queryObj.fields.push(this.fieldName);
    queryObj.fields.push(this.humanFieldName);
    queryObj.fq = queryObj.fq.concat(this.getItems());
  },

  handleResult: function(data) {
    if (data.facet_counts) {
      // we want to display only the human-readable facet values
      this.facetFields = data.facet_counts.facet_fields[this.humanFieldName];
      this.facetDates = data.facet_counts.facet_dates[this.humanFieldName];
      // allow the child implementation to handle the result.
      this._handleResult();
    }
  },

  /**
   * An abstract hook for child implementations.
   * Allow the child to handle the result without parsing the response.
   *
   * @throws If not defined in child implementation.
   */
  _handleResult: function() {
    throw 'Abstract method _handleResult';
  },

  /**
   * Returns all the selected items as filter query items.
   *
   * @returns {FilterQueryItem[]}
   */
  getItems: function() {
    var items = [];
    for (var i = 0; i < this.selectedItems.length; i++) {
      items.push(new AjaxSolr.FilterQueryItem({
        // the facet value that is selectable is the human-readable value, so
        // the filter query item should use the field for human-readable values
        field: this.humanFieldName,
        value: this.selectedItems[i],
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
  unclickHandler: function(value) {
    var me = this;
    return function() {
      me.manager.deselectItems(me.id, [ value ]);
      return false;
    }
  },

  /**
   * Returns a function to select the given value.
   *
   * @param value The given value.
   * @returns {Function}
   */
  clickHandler: function(value) {
    var me = this;
    return function() {
      me.manager.selectItems(me.id, [ value ]);
      return false;
    }
  },

  /**
   * Returns a string representation of the value to deselect.
   *
   * @param value The value to deselect.
   * @returns {String}
   */
  unclickText: function(value) {
    return value;
  },

  /**
   * Returns a string representation of the value to select.
   *
   * @param value The value to select.
   * @returns {String}
   */
  clickText: function(value) {
    return value;
  }
});
