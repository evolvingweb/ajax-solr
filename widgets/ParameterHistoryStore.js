;(function(history) {
  /**
   * A parameter store that stores the values of exposed parameters in the URL via History.js
   * to maintain the application's state. This uses the HTML5 History API for newer browsers, and 
   * falls back to using the hash in older browsers.
   *
   * @class ParameterHistoryStore
   * @augments AjaxSolr.ParameterStore
   * @see https://github.com/balupton/History.js/
   * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/history.html
   */
  AjaxSolr.ParameterHistoryStore = AjaxSolr.ParameterStore.extend(
    /** @lends AjaxSolr.ParameterHistoryStore.prototype */
    {
    init: function () {
      if (this.exposed.length) {
  	  // Ensure History.js is loaded
        if (!history) {
          throw new Error('ParameterHistoryStore requires History.js to be loaded');
        }
        
        history.Adapter.bind(window, 'statechange', this.stateChangeFunction(this));
      }
    },
  
    /**
     * Stores the values of the exposed parameters in both the local hash and History.js
     * No other code should be made to change these two values.
     */
    save: function () {
      this.hash = this.exposedString();
      history.pushState({ params: this.hash }, null, '?' + this.hash);
    },
  
    /**
     * @see ParameterStore#storedString()
     */
    storedString: function () {
      var state = history.getState();
    
      // Check for state in the history object
      if (state.data && state.data.params) {
        return state.data.params;
      }
      
      // No state (eg. initial load), get state from URL  
      var url = state.cleanUrl, index = url.indexOf('?');
      if (index == -1) {
        return '';
      }
      else {
        return url.substr(index + 1);
      }
    },
  
    /**
     * Called when History.js detects a state change. Checks if state is different to previous state, 
     * and if so, sends a request to Solr. This needs to check if the state has changed since it also
     * gets called when we call pushState above.
     */
    stateChangeFunction: function (self) {
      return function () {
        var hash = self.storedString();
  	  
  	  // Check if URL has changed since last request (ie. using back/forward navigation)
        if (self.hash != hash) {
          self.load();
          self.manager.doRequest();
        }
      }
    }
  });
})(window.History);