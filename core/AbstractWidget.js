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
   * A CSS selector representing the "target div" inside the HTML page.
   * All UI changes will usually be performed within this div.
   * 
   * @field 
   * @public
   * @type String
   */
  target: null,

  /** 
   * A CSS selector representing the "container div" inside the HTML page.
   * A widget need not necessarily have a container div.
   * 
   * @field 
   * @public
   * @type String
   */
  container: null,

  /**
   * A reference to the widget's manager. For internal use only.
   *
   * @field
   * @private
   */
  manager: null,

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method should do any necessary one-time initializations.</p>
   */
  init: function () {},

  /** 
   * An abstract hook for child implementations.
   *
   * <p>This method is executed before the Solr request is sent.</p>
   */
  beforeRequest: function () {},

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method is executed after the Solr response is received.</p>
   */
  afterRequest: function () {}
});
