// $Id$

/**
 * The Manager acts as a container for all widgets. 
 * It stores Solr configuration and delegates calls to the widgets.
 * All public calls should be performed on the manager object.
 *
 * @param properties A map of fields to set. Refer to the list of public fields.
 * @class AbstractManager
 */
AjaxSolr.AbstractManager = AjaxSolr.Class.extend(
  /** @lends AjaxSolr.AbstractManager.prototype */
  {
  /** 
   * The absolute URL to the Solr instance.
   *
   * @field
   * @public
   * @type String
   * @default http://localhost:8983/solr/select/
   */
  solrUrl: 'http://localhost:8983/solr/select/',

  /**
   * If we want to proxy queries through a script, rather than send queries
   * to Solr directly, set the passthruUrl field to the fully-qualified URL.
   *
   * @field
   * @public
   * @type String
   */
  passthruUrl: null,

  /**
   * The query to use if no query is set. A query must be set if there are any
   * Spatial Solr local parameters, to avoid a HTTP 500 error.
   *
   * @field
   * @public
   * @type String
   * @default "*:*"
   */
  queryAll: '*:*',

  /**
   * URL hash separator.
   *
   * @field
   * @public
   * @type String
   * @default "&"
   */
  separator: '&',

  /**
   * Default facet.limit parameter.
   *
   * @field
   * @public
   * @type Number
   */
  facetLimit: 20,

  /**
   * Default facet.missing parameter.
   *
   * @field
   * @public
   * @type Number
   */
  facetMissing: false,

  /**
   * Items to append to the hash, e.g. "fq=type:cat". Items will be appended to
   * the hash while initializing the manager, if the hash is empty.
   *
   * @field
   * @public
   * @type String[]
   * @default []
   */
  defaults: [],

  /**
   * Filters to add to all queries. Filters will be appended to the list of 
   * filters before each request.
   *
   * @field
   * @public
   * @default []
   */
  constraints: [],

  /**
   * The field to highlight when rendering results.
   *
   * @field
   * @public
   * @type String
   * @default "body"
   */
  hlFl: 'body',

  /** 
   * A collection of all registered widgets. For internal use only.
   *
   * @field
   * @private 
   * @default {}
   */
  widgets: {},

  /** 
   * The Solr start offset parameter.
   *
   * @field
   * @private 
   * @type Number
   * @default 0
   */
  start: 0,

  /**
   * A copy of the URL hash, so we can detect any changes to it.
   *
   * @field
   * @private
   * @type String
   * @default ""
   */
  hash: '',

  /**
   * Reference to the setInterval() function.
   *
   * @field
   * @private
   * @type Function
   */
  intervalId: null,

  /** 
   * Adds a widget to the manager.
   *
   * @param {AjaxSolr.AbstractWidget} widget
   */
  addWidget: function (widget) { 
    if (this.canAddWidget(widget)) {
      widget.manager = this;
      this.widgets[widget.id] = widget;
      widget.afterAdditionToManager();
    }
  },

  /**
   * An abstract hook for child implementations.
   *
   * @param {AjaxSolr.AbstractWidget} widget
   * @returns {Boolean} Whether the DOM is ready for the widget.
   */
  canAddWidget: function (widget) {
    return true;
  },

  /**
   * Initializes the manager.
   *
   * Loads the query from the hash, submits a request, and adds hash change
   * listeners to submit requests if the hash changes, e.g. back button click.
   */
  init: function () {
    this.loadQueryFromHash(true);
    this.doInitialRequest();

    // Support the back button.
    var me = this;
    this.intervalId = window.setInterval(function () {
      var hash = AjaxSolr.hash();
      if (hash.length && hash != me.defaults.join(this.separator)) {
        if (me.hash != hash) {
          me.loadQueryFromHash();
          me.doInitialRequest();
        }
      }
      // Without this condition, the user is not able to back out of search.
      else {
        if (me.defaults.length) {
          history.go(-2);
        }
        else {
          history.go(-1);
        }
        clearInterval(me.intervalId);
      }
    }, 250);
  },

  /**
   * Removes all filters from all facet widgets.
   */
  reset: function () {
    for (var widgetId in this.widgets) {
      // Assumes only facet widgets have a field property.
      if (this.widgets[widgetId].field) {
        this.widgets[widgetId].clear();
      }
    }
  },

  /**
   * Loads the query from the URL hash.
   *
   * @param {Boolean} first Whether this is the first parsing of the hash.
   */
  loadQueryFromHash: function (first) {
    // if the page is loading for the first time, don't clobber properties set
    // during afterAdditionToManager().
    if (AjaxSolr.hash().length) {
      for (var widgetId in this.widgets) {
        if (this.widgets[widgetId].clear) {
          this.widgets[widgetId].clear();
        }
      }
    }
    else if (first) {
      window.location.hash = this.defaults.join(this.separator);
    }

    var hash = AjaxSolr.hash();

    var pairs = hash.split(this.separator);

    for (var i = 0, length = pairs.length; i < length; i++) {
      if (pairs[i].startsWith('start=')) {
        this.start = parseInt(pairs[i].substring(6));
      }
    }

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].loadFromHash(first, pairs);
    }
  },

  /**
   * Stores the query in the URL hash.
   *
   * @param queryObj The query object built by buildQuery.
   */
  saveQueryToHash: function (queryObj) {
    var pairs = [ 'start=' + queryObj.start ];

    for (var widgetId in this.widgets) {
      var value = this.widgets[widgetId].addToHash(queryObj);
      if (value) {
        if (AjaxSolr.isArray(value)) {
          pairs = pairs.concat(value);
        }
        else {
          pairs.push(value);
        }
      }
    }

    window.location.hash = pairs.join(this.separator);

    this.hash = AjaxSolr.hash();
  },

  /**
   * Returns an object decorated with Solr parameters, e.g. q, fl, fq, start,
   * rows, fields, dates, sort, etc. Used in buildQuery(), alterQuery(), 
   * displayQuery(), executeRequest(), and saveQueryToHash().
   *
   * @param {Number} start The Solr start offset parameter.
   * @returns The query object.
   */
  buildQuery: function (start) {
    var queryObj = {
      q: '',
      dates: [],
      fields: [],
      fl: [],
      fq: this.constraints.slice(0),
      params: {},
      rows: 0,
      sort: '',
      start: start,
      localParams: {
        q: {},
        'facet.field': {
          ex: []
        }
      }
    };

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].buildQuery(queryObj);
    }

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].alterQuery(queryObj);
    }

    return queryObj;
  },

  /**
   * Transforms a query object into a string for execution.
   *
   * @param queryObj The query object built by buildQuery.
   * @returns {String} The query object as a string.
   */
  buildQueryString: function (queryObj) {
    // Basic facet info. Return facet data and ignore anything with 0 results.
    var query = 'facet=true&facet.mincount=1&facet.sort=true&hl=true';

    var params = [];
    for (var param in queryObj.params) {
      params.push(param + '=' + queryObj.params[param]);
    }
    if (params.length) {
      query += '&' + params.join('&');
    }

    for (var i = 0, length = queryObj.dates.length; i < length; i++) {
      var field = queryObj.dates[i].field;
      query += '&facet.date=' + encodeURIComponent(field);
      query += '&f.' + field + '.facet.date.start=' + encodeURIComponent(queryObj.dates[i].start);
      query += '&f.' + field + '.facet.date.end=' + encodeURIComponent(queryObj.dates[i].end);
      query += '&f.' + field + '.facet.date.gap=' + encodeURIComponent(queryObj.dates[i].gap);
    }

    // Group the filter query items by widgetId, not by field, since widgets
    // for the same field may have different operators.
    var groups = {};

    for (var i = 0, length = queryObj.fq.length; i < length; i++) {
      if (groups[queryObj.fq[i].widgetId] == undefined) {
        groups[queryObj.fq[i].widgetId] = [];
      }
      groups[queryObj.fq[i].widgetId].push(queryObj.fq[i].toSolr());
    }

    for (var widgetId in groups) {
      // http://stackoverflow.com/questions/1343794/searching-for-date-range-or-null-no-field-in-solr
      if (this.widgets[widgetId].orNull) {
        query += '&fq={!tag=' + widgetId + '}' + '-(-(' + groups[widgetId].join(' ' + this.widgets[widgetId].operator + ' ') + ') AND ' + this.widgets[widgetId].field + ':' + encodeURIComponent('[* TO *]') + ')';
      }
      else {
        query += '&fq={!tag=' + widgetId + '}' + groups[widgetId].join(' ' + this.widgets[widgetId].operator + ' ');
      }
    }

    for (var i = 0, length = queryObj.fields.length; i < length; i++) {
      var field = queryObj.fields[i].field;
      query += '&facet.field=' + this.buildLocalParams(queryObj.localParams['facet.field']) + encodeURIComponent(field);
      if (queryObj.fields[i].limit != this.facetLimit) {
        query += '&f.' + field + '.facet.limit=' + encodeURIComponent(queryObj.fields[i].limit);
      }
      if (queryObj.fields[i].missing != this.facetMissing) {
        query += '&f.' + field + '.facet.missing=' + encodeURIComponent(queryObj.fields[i].missing);
      }
    }

    if (queryObj.q) {
      query += '&q=' + this.buildLocalParams(queryObj.localParams.q) + encodeURIComponent(queryObj.q);
    }
    else {
      query += '&q.alt=' + this.buildLocalParams(queryObj.localParams.q) + encodeURIComponent(this.queryAll);
    }

    queryObj.fl.push('id');

    query += '&fl=' + queryObj.fl.join(',');
    query += '&rows=' + queryObj.rows;
    query += '&start=' + queryObj.start;
    if (queryObj.sort && queryObj.sort != 'score desc') {
      query += '&sort=' + queryObj.sort;
    }

    query += '&hl.fl=' + this.hlFl;
    query += '&facet.limit=' + this.facetLimit;
    query += '&facet.missing=' + this.facetMissing;

    return query;
  },

  /**
   * Helper for buildQueryString.
   *
   * @see http://wiki.apache.org/solr/LocalParams
   * @param {Object} An associative array of local parameters.
   * @returns {String} A local parameter prefix.
   */
  buildLocalParams: function(obj) {
    var params = [];
    for (var key in obj) {
      if (AjaxSolr.isArray(obj[key])) {
        if (obj[key].length) {
          params.push(key + '=' + obj[key].join(','));
        }
      }
      else if (obj[key]) {
        params.push(key + '=' + obj[key]);
      }
    }
    if (params.length) {
      return '{!' + params.join(' ') + '}';
    }
    return '';
  },

  /** 
   * Creates a Solr query, starts any widget loading animations, displays the
   * query, requests the data from the Solr server, and saves the query to the
   * URL hash to support bookmarking and the back button.
   *
   * @param {Number} start The Solr start offset parameter.
   */
  doRequest: function (start) {
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
  doInitialRequest: function () {
    this.doRequest(this.start);
  },

  /**
   * An abstract hook for child implementations.
   * Sends the request to Solr and handles the response.
   * Should use jsonCallback() to handle the request.
   *
   * @param queryObj The query object built by buildQuery.
   * @throws If not defined in child implementation.
   */
  executeRequest: function (queryObj) {
    throw 'Abstract method executeRequest';
  },

  /**
   * Returns the callback to feed to, e.g. jQuery.getJSON or jQuery.post.
   *
   * @returns {Function}
   */
  jsonCallback: function () {
    var me = this;
    return function (data) {
      me.handleResult(data);
    }
  },

  /**
   * This method is executed after the Solr response data arrives. Passes the
   * Solr response to the widgets, for each widget to handle separately, and
   * ends any widget loading animations.
   *
   * @param data The Solr response inside a JavaScript object.
   */
  handleResult: function (data) {
    // For debugging purposes
    this.responseCache = data;

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].handleResult(data);
    }

    for (var widgetId in this.widgets) {
      this.widgets[widgetId].endAnimation();
    }
  }
});
