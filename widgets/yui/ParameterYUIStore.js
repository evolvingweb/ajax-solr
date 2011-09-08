// $Id$

/**
 * A parameter store that stores the values of exposed parameters using the YUI
 * History Manager to maintain the application's state.
 *
 * @class ParameterYUIStore
 * @augments AjaxSolr.ParameterStore
 */
AjaxSolr.ParameterYUIStore = AjaxSolr.ParameterStore.extend(
  /** @lends AjaxSolr.ParameterYUIStore.prototype */
  {

  /**
   * Initializes the YUI History Manager.
   */
  init: function () {
    if (this.exposed.length) {
      var self = this;
      YAHOO.util.History.register('q', YAHOO.util.History.getBookmarkedState('q') || this.exposedString(), function () {
        self.load();
        self.manager.doRequest();
      });
      YAHOO.util.History.onReady(function () {
        self.load();
        self.manager.doRequest();
      });
      YAHOO.util.History.initialize('yui-history-field', 'yui-history-iframe');
    }
  },

  /**
   * Stores the values of the exposed parameters in the YUI History Manager.
   */
  save: function () {
    YAHOO.util.History.navigate('q', this.exposedString());
  },

  /**
   * @see ParameterStore#storedString()
   */
  storedString: function () {
    return YAHOO.util.History.getCurrentState('q');
  }
});
