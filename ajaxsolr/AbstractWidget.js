// $Id$

AjaxSolr.AbstractWidget = AjaxSolr.Class.extend({
  /** 
   * A unique identifier of this widget.
   *
   * @field 
   * @public
   */
  id: '', 

  /** 
   * A CSS classname representing the "target div" inside the html page.
   * All UI changes will be performed inside this empty div.
   * 
   * @field 
   * @public
   */
  target: '',

  /** 
   * A CSS classname representing the "container div" inside the html page.
   * A widget need not necessarily have a container div.
   * 
   * @field 
   * @public
   */
  container: '',

  /**
   * A flag that indicates whether new selected items should replace old ones.
   *
   * @field
   * @private
   */
  replace: false,

  /** 
   * A flag that indicates whether we should animate the update of the target div.
   * 
   * @field 
   * @private
   */
  animate: false,

  /**
   * The list of selected items.
   *
   * @field
   * @private
   */
  selectedItems: [],

  /**
   * Add the given items to the list of selected items.
   *
   * @param items An array of items.
   * @return True if selection changed.
   */
  selectItems: function(items) {
    if (this.replace) {
      this.deselectAll();
    }
    var start = this.selectedItems.length;
    for (var i = 0; i < items.length; i++) {
      // can't do loop as in deselectItems() because here we are testing if an
      // item is not in the array, rather than if an item is in the array
      if (!AjaxSolr.contains(this.selectedItems, items[i])) {
        this.selectedItems.push(items[i]);
      }
    }
    if (this.selectedItems.length > start) {
      this.afterChangeSelection();
    }
    return this.selectedItems.length > start;
  },

  /**
   * Removes the given items from the list of selected items.
   *
   * @param items An array of items.
   * @return True if selection changed.
   */
  deselectItems: function(items) {
    var start = this.selectedItems.length;
    for (var i = 0; i < items.length; i++) {
      for (var j = this.selectedItems.length - 1; j >= 0; j--) {
        if (this.selectedItems[j] == items[i]) {
          this.selectedItems.splice(j, 1);
        }
      }
    }
    if (this.selectedItems.length < start) {
      this.afterChangeSelection();
    }
    return this.selectedItems.length < start;
  },

  /**
   * Removes all items from the current selection.
   */
  deselectAll: function() {
    this.selectedItems = [];
    this.afterChangeSelection();
  },

  // Methods to be overridden by widgets:

  /**
   * An abstract hook for child implementations.
   * Alters the query before it is run.
   *
   * @param queryObj The query object built by buildQuery.
   */
  alterQuery: function(queryObj) {},

  /**
   * An abstract hook for child implementations.
   * Displays the query before it is run.
   *
   * @param queryObj The query object built by buildQuery.
   */
  displayQuery: function(queryObj) {},

  /**
   * An abstract hook for child implementations.
   * This method is executed after the Solr response data arrives.
   *
   * @param data The Solr response inside a JavaScript object.
   */
  handleResult: function(data) {},

  /** 
   * An abstract hook for child implementations.
   * This method need only be defined if animate=true.
   */
  startAnimation: function() {},

  /** 
   * An abstract hook for child implementations.
   * This method need only be defined if animate=true.
   */
  endAnimation: function() {},

  /**
   * An abstract hook for child implementations.
   * This method should do any necessary one-time initializations.
   */
  afterAdditionToManager: function() {},

  /**
   * An abstract hook for child implementations.
   * This method is executed after items are selected or deselected.
   */
  afterChangeSelection: function() {}
});
