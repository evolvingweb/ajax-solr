// $Id$

/**
 * Baseclass for all widgets. 
 * 
 * Provides abstract hooks for child classes.
 *
 * @param properties A map of fields to set. May be new or public fields.
 * @class AbstractWidget
 */
AjaxSolr.AbstractWidget = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.AbstractWidget.prototype */
  {
  /** 
   * A unique identifier of this widget.
   *
   * @field 
   * @public
   * @type String
   */
  id: null,

  /** 
   * A CSS selector representing the "target div" inside the html page.
   * All UI changes will be performed inside this empty div.
   * 
   * @field 
   * @public
   * @type String
   */
  target: null,

  /** 
   * A CSS selector representing the "container div" inside the html page.
   * A widget need not necessarily have a container div.
   * 
   * @field 
   * @public
   * @type String
   */
  container: null,

  /** 
   * A flag that indicates whether we should animate the update of the target.
   * 
   * @field
   * @private
   * @type Boolean
   * @default false
   */
  animate: false,

  /**
   * An abstract hook for child implementations.
   * Alters the query before it is run.
   *
   * @param queryObj The query object built by buildQuery.
   */
  alterQuery: function (queryObj) {},

  /**
   * An abstract hook for child implementations.
   * Displays the query before it is run.
   *
   * @param queryObj The query object built by buildQuery.
   */
  displayQuery: function (queryObj) {},

  /**
   * An abstract hook for child implementations.
   * This method is executed after the Solr response data arrives.
   *
   * @param data The Solr response inside a JavaScript object.
   */
  handleResult: function (data) {},

  /** 
   * An abstract hook for child implementations.
   * This method need only be defined if animate=true.
   */
  startAnimation: function () {},

  /** 
   * An abstract hook for child implementations.
   * This method need only be defined if animate=true.
   */
  endAnimation: function () {},

  /**
   * An abstract hook for child implementations.
   * This method should do any necessary one-time initializations.
   */
  afterAdditionToManager: function () {}
});
