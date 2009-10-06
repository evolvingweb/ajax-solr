// $Id$

/**
 * The Manager acts as a container for all widgets. 
 * It stores Solr configuration and selection and delegates calls to the widgets.
 * All public calls should be performed on the manager object.
 */
AjaxSolr.AbstractManager = AjaxSolr.Class.extend({
  /** 
   * The absolute URL to the Solr instance.
   *
   * @field
   * @public
   * @default http://localhost:8983/solr/select/
   */
  solrUrl: 'http://localhost:8983/solr/select/',

  /**
   * If we want to proxy queries through a script, rather than send queries
   * to Solr directly, set the passthruUrl field to the fully-qualified URL.
   *
   * @field
   * @public
   */
  passthruUrl: '',

  /**
   * Filters to apply to all queries.
   *
   * @field
   * @public
   */
  filters: {
    q: [],
    fq: [],
    fl: []
  },

  /**
   * The field to highlight when rendering results.
   *
   * @field
   * @public
   */
  hlFl: 'body',

  /** 
   * A collection of all registered widgets. For internal use only.
   *
   * @field
   * @private 
   */
  widgets: [],

  /** 
   * The starting result to display, so page = start/rows
   *
   * @field
   * @private 
   */
  start: 0,

  /**
   * A copy of the URL hash.
   *
   * @field
   * @private
   */
  hash: '',

  /** 
   * Adds a widget to this manager.
   *
   * @param {AjaxSolr.AbstractWidget} widget An instance of AbstractWidget.
   */
  addWidget: function(widget) { 
    if (this.canAddWidget(widget)) {
      widget.manager = this;
      this.widgets[widget.id] = widget;
      widget.afterAdditionToManager();
    }
  },

  /**
   * An abstract hook for child implementations.
   *
   * @return True if ready to add widget to this manager.
   */
  canAddWidget: function(widget) {
    return true;
  },

  /**
   * Initializes the manager.
   *
   * Loads the query from the hash, submits a request, and adds hash change
   * listeners to submit requests if the hash changes, e.g. back button click.
   */
  init: function() {
    this.loadQueryFromHash();
    this.doInitialRequest();

    // Support the back button.
    var me = this;
    window.setInterval(function() {
      if (window.location.hash.length) {
        if (me.hash != window.location.hash) {
          me.loadQueryFromHash();
          me.doInitialRequest();
        }
      }
      // Without this condition, the user is not able to back out of search.
      else {
        history.back();
      }
    }, 250);
  },

  /** 
   * Adds the given items to the given widget, and runs the request.
   *
   * @param widgetId The widgetId of the widget.
   * @param items An array of items, or a single item.
   */
  selectItems: function(widgetId, items) {
    if (this.widgets[widgetId].selectItems(items)) {
      this.doRequest(0);
    }
  },

  /** 
   * Removes the given items from the given widget, and runs the request.
   *
   * @param widgetId The widgetId of the widget.
   * @param items An array of items, or a single item.
   */  
  deselectItems: function(widgetId, items) {
    if (this.widgets[widgetId].deselectItems(items)) {
      this.doRequest(0);
    }
  },

  /**
   * Removes all items from the given widget, and runs the request.
   *
   * @param widgetId The widgetId of the widget.
   */
  deselectWidget: function(widgetId) {
    this.widgets[widgetId].deselectAll();
    this.doRequest(0);
  },

  selectOnlyItems: function(keepId, items) {
    for (var widgetId in this.widgets) {
      if (widgetId == keepId) {
        this.widgets[keepId].selectItems(items);
      }
      else {
        this.widgets[widgetId].deselectAll();
      }
    }
    this.doRequest(0);
  },

  /**
   * Removes all items from all widgets, except the given widget.
   */
  selectOnlyWidget: function(keepId) {
    for (var widgetId in this.widgets) {
      if (widgetId != keepId) {
        this.widgets[widgetId].deselectAll();
      }
    }
    this.doRequest(0);
  },

  /**
   * Removes all items from all widgets, and runs the request.
   */
  deselectAll: function() {
    for (var widgetId in this.widgets) {
      this.widgets[widgetId].deselectAll();
    }
    this.doRequest(0);
  },

  /**
   * Load the query from the URL hash.
   */
  loadQueryFromHash: function() {
    // if the hash is empty, the page must be loading for the first time,
    // so don't clobber items selected during afterAdditionToManager().
    if (window.location.hash.length) {
      for (var widgetId in this.widgets) {
        this.widgets[widgetId].deselectAll();
      }
    }

    var hash = window.location.hash.substring(1);
    var vars = hash.split('&');

    for (var i = 0; i < vars.length; i++) {
      if (vars[i].substring(0, 3) == 'fq=') {
        var item = new AjaxSolr.FilterQueryItem();
        item.parseHash(vars[i].substring(3));

        if (this.widgets[item.widgetId]) {
          this.widgets[item.widgetId].selectItems([ item.value ]);
        }
      }
      else if (vars[i].substring(0, 2) == 'q=') {
        var item = new AjaxSolr.QueryItem();
        item.parseHash(vars[i].substring(2));

        if (this.widgets.text) {
          this.widgets.text.selectItems([ item.value ]);
        }
      }
      else if (vars[i].substring(0, 6) == 'start=') {
        this.start = parseInt(vars[i].substring(6));
      }
    }
  },

  /**
   * Stores the query in the URL hash.
   *
   * @param queryObj The query object built by buildQuery.
   */
  saveQueryToHash: function(queryObj) {
    var hash = '#';
    for (var i in queryObj.fq) {
      hash += 'fq=' + queryObj.fq[i].toHash() + '&';
    }
    for (var i in queryObj.q) {
      hash += 'q=' + queryObj.q[i].toHash() + '&';
    }
    hash += 'start=' + queryObj.start;

    window.location.hash = hash;

    // Don't assign this.hash to hash as window.location.hash undergoes some
    // internal processing after assignment. Assign it to window.location.hash
    // after setting window.location.hash to ensure the two are equal.
    this.hash = window.location.hash;
  },

  /**
   * @param start The Solr start offset parameter.
   * @return A query object for the given widget.
   */
  buildQuery: function(start) {
    var queryObj = {
      fields: [],
      dates: []
    };

    queryObj.q = this.filters.q.slice();
    queryObj.fl = this.filters.fl.slice();
    queryObj.fq = this.filters.fq.slice();
    queryObj.start = start;
    queryObj.rows = 0;

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].alterQuery(queryObj);
    }

    return queryObj;
  },

  /**
   * Transforms a query object into a string for execution.
   *
   * @param queryObj The query object built by buildQuery.
   * @param skip Whether to skip URL encoding.
   * @return The query object as a string.
   */
  buildQueryString: function(queryObj, skip) {
    // Basic facet info. Return the top 40 items for each facet and ignore anything with 0 results
    var query = 'facet=true&facet.limit=40&facet.sort=true&facet.mincount=1&hl=true';

    // Fields is the list of facets that will have counts and such returned
    for (var i in queryObj.fields) {
      query += '&facet.field=' + queryObj.fields[i].urlencode(skip);
    }

    for (var i in queryObj.dates) {
      var field = queryObj.dates[i].field;
      query += '&facet.date=' + field.urlencode(skip);
      query += '&f.' + field + '.facet.date.start=' + queryObj.dates[i].start.urlencode(skip);
      query += '&f.' + field + '.facet.date.end=' + queryObj.dates[i].end.urlencode(skip);
      query += '&f.' + field + '.facet.date.gap=' + queryObj.dates[i].gap.urlencode(skip);
    }

    // Solr uses fq for facet based searching
    for (var i in queryObj.fq) {
      query += '&fq=' + queryObj.fq[i].toSolr(skip);
    }

    // Solr uses q for free text searching
    var q = '';
    for (var i in queryObj.q) {
      q += queryObj.q[i].toSolr(skip) + ' ';
    }
    query += '&q=' + q;

    queryObj.fl.push('id');

    query += '&fl=' + queryObj.fl.join(',');
    query += '&rows=' + queryObj.rows;
    query += '&start=' + queryObj.start;
    if (queryObj.sort) {
      query += '&sort=' + queryObj.sort;
    }

    query += '&hl.fl=' + this.hlFl;

    return query;
  },

  /** 
   * Creates a query out of the current selection and calls all bound widgets to
   * request their data from the server.
   *
   * @param start The Solr start offset parameter.
   */
  doRequest: function(start) {
    var queryObj = this.buildQuery(start);

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].startAnimation();
    }

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].displayQuery(queryObj);
    }

    this.executeRequest(queryObj);

    this.saveQueryToHash(queryObj);
  },

  /**
   * Calls doRequest() with the current start offset.
   */
  doInitialRequest: function() {
    this.doRequest(this.start);
  },

  /**
   * An abstract hook for child implementations.
   * Sends the request to Solr and handles the response.
   * Should use jsonCallback() to handle the request.
   *
   * @param queryObj The query string built by buildQuery().
   */
  executeRequest: function(queryObj) {
    throw 'Abstract method executeRequest';
  },

  /**
   * @return The callback to feed to jQuery.getJSON or jQuery.post.
   */
  jsonCallback: function() {
    var me = this;
    return function(data) {
      me.handleResult(data);
    }
  },

  /**
   * This method is executed after the Solr response data arrives.
   *
   * @param data The Solr response inside a JavaScript object.
   */
  handleResult: function(data) {
    //For debugging purposes
    this.responseCache = data;

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].handleResult(data);
    }

    for (var i in this.widgets) {
      this.widgets[i].endAnimation();
    }
  }
});
