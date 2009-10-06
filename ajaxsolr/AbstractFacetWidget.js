// $Id$

AjaxSolr.AbstractFacetWidget = AjaxSolr.AbstractWidget.extend({
  /**
   * Facet on this field.
   *
   * @field
   * @public
   */
  fieldName: '',

  /**
   * This field contains the human-readable versions of the values stored in
   * the field fiendName.
   *
   * @field
   * @public
   */
  humanFieldName: '',

  /**
   * Maximum number of facet values to display.
   *
   * @field
   * @public
   */
  limit: '',

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
      this._handleResult();
    }
  },

  /**
   * An abstract hook for child implementations.
   * Allow the child to handle the result without parsing the response.
   */
  _handleResult: function() {
    throw 'Abstract method _handleResult';
  },

  /**
   * Returns all the selected items as query items.
   *
   * @return An array of FilterQueryItem objects.
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
   * @param value The given value.
   * @return A function to deselect the given value.
   */
  unclickHandler: function(value) {
    var me = this;
    return function() {
      me.manager.deselectItems(me.id, [ value ]);
      return false;
    }
  },

  /**
   * @param value The given value.
   * @return A function to select the given value.
   */
  clickHandler: function(value) {
    var me = this;
    return function() {
      me.manager.selectItems(me.id, [ value ]);
      return false;
    }
  },

  /**
   * @param value The value to deselect.
   * @return A textual repesentation of the value.
   */
  unclickText: function(value) {
    return value;
  },

  /**
   * @param value The value to select.
   * @return A textual repesentation of the value.
   */
  clickText: function(value) {
    return value;
  }
});
