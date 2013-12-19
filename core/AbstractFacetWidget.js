(function (callback) {
  if (typeof define === 'function' && define.amd) {
    define(['core/AbstractWidget', 'core/Parameter'], callback);
  }
  else {
    callback();
  }
}(function () {


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
   * @param {Object} attributes
   * @param {String} attributes.field The field to facet on.
   * @param {Number} [attributes.start] This widget will by default set the
   *   offset parameter to 0 on each request.
   * @param {Boolean} [attributes.multivalue] Set to <tt>false</tt> to force a
   *   single "fq" parameter for this widget. Defaults to <tt>true</tt>.
   */
  constructor: function (attributes) {
    AjaxSolr.AbstractFacetWidget.__super__.constructor.apply(this, arguments);
    AjaxSolr.extend(this, {
      start: 0,
      field: null,
      multivalue: true
    }, attributes);
  },

  init: function () {
    this.initStore();
  },

  /**
   * Add facet parameters to the parameter store.
   */
  initStore: function () {
    /* http://wiki.apache.org/solr/SimpleFacetParameters */
    var parameters = [
      'facet.prefix',
      'facet.sort',
      'facet.limit',
      'facet.offset',
      'facet.mincount',
      'facet.missing',
      'facet.method',
      'facet.enum.cache.minDf'
    ];

    this.manager.store.addByValue('facet', true);

    // Set facet.field, facet.date or facet.range to truthy values to add
    // related per-field parameters to the parameter store.
    if (this['facet.field'] !== undefined) {
      this.manager.store.addByValue('facet.field', this.field);
    }
    else if (this['facet.date'] !== undefined) {
      this.manager.store.addByValue('facet.date', this.field);
      parameters = parameters.concat([
        'facet.date.start',
        'facet.date.end',
        'facet.date.gap',
        'facet.date.hardend',
        'facet.date.other',
        'facet.date.include'
      ]);
    }
    else if (this['facet.range'] !== undefined) {
      this.manager.store.addByValue('facet.range', this.field);
      parameters = parameters.concat([
        'facet.range.start',
        'facet.range.end',
        'facet.range.gap',
        'facet.range.hardend',
        'facet.range.other',
        'facet.range.include'
      ]);
    }
    /***************************
     * Added new parameter for facet.pivot: according to the documentation
     * there is only facet.pivot.mincount
     * ************************/
    else if (this['facet.pivot'] !== undefined) {
      this.manager.store.addByValue('facet.pivot', this.field);
      parameters = parameters.concat([
        'facet.pivot.mincount',
      ]);
    }

    for (var i = 0, l = parameters.length; i < l; i++) {
      if (this[parameters[i]] !== undefined) {
        this.manager.store.addByValue('f.' + this.field + '.' + parameters[i], this[parameters[i]]);
      }
    }
  },

  /**
   * @returns {Boolean} Whether any filter queries have been set using this
   *   widget's facet field.
   */
  isEmpty: function () {
    return !this.manager.store.find('fq', new RegExp('^-?' + this.field + ':'));
  },

  /**
   * Sets the filter query.
   *
   * @returns {Boolean} Whether the selection changed.
   */
  set: function (value) {
    return this.changeSelection(function () {
      var a = this.manager.store.removeByValue('fq', new RegExp('^-?' + this.field + ':')),
          b = this.manager.store.addByValue('fq', this.fq(value));
      return a || b;
    });
  },

  /**
   * Adds a filter query.
   *
   * @returns {Boolean} Whether a filter query was added.
   */
  add: function (value) {
    return this.changeSelection(function () {
      return this.manager.store.addByValue('fq', this.fq(value));
    });
  },
  
    /**
   * Adds a filter query independent of the widget facet field.
   *
   * @returns {Boolean} Whether a filter query was added.
   */
  addByField: function (field, value) {
   	return this.changeSelection(function () {
      return this.manager.store.addByValue('fq', (field+':'+value));
    });
  },

  /**
   * Removes a filter query.
   *
   * @returns {Boolean} Whether a filter query was removed.
   */
  remove: function (value) {
    return this.changeSelection(function () {
      return this.manager.store.removeByValue('fq', this.fq(value));
    });
  },

  /**
   * Removes all filter queries using the widget's facet field.
   *
   * @returns {Boolean} Whether a filter query was removed.
   */
  clear: function () {
    return this.changeSelection(function () {
      return this.manager.store.removeByValue('fq', new RegExp('^-?' + this.field + ':'));
    });
  },

  /**
   * Helper for selection functions.
   *
   * @param {Function} Selection function to call.
   * @returns {Boolean} Whether the selection changed.
   */
  changeSelection: function (func) {
    changed = func.apply(this);
    if (changed) {
      this.afterChangeSelection();
    }
    return changed;
  },

  /**
   * An abstract hook for child implementations.
   *
   * <p>This method is executed after the filter queries change.</p>
   */
  afterChangeSelection: function () {},

  /**
   * One of "facet.field", "facet.date" or "facet.range" must be set on the
   * widget in order to determine where the facet counts are stored.
   *
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCounts: function () {
    var property;
    if (this['facet.field'] !== undefined) {
      property = 'facet_fields';
    }
    else if (this['facet.date'] !== undefined) {
      property = 'facet_dates';
    }
    else if (this['facet.range'] !== undefined) {
      property = 'facet_ranges';
    }
    else if (this['facet.pivot'] !== undefined) {
      property = 'facet_pivot';
    }   
    if (property !== undefined) {
	 /* -------------------------------------------------------------------------------------------------
		New If added to control the case of the facet_pivots: we do not know how the
		* json.nl value would affect pivots, therefore this special case.
	 -----------------------------------------*/
		if (property==='facet_pivot'){
			return this.getPivotCountsMap(property);
		}else{
	//---------------------------------------------------------------------------------------------------
			switch (this.manager.store.get('json.nl').val()) {
			case 'map':
			  return this.getFacetCountsMap(property);
			case 'arrarr':
			  return this.getFacetCountsArrarr(property);
			default:
			  return this.getFacetCountsFlat(property);
			}	
		}
    }
    throw 'Cannot get facet counts unless one of the following properties is set to "true" on widget "' + this.id + '": "facet.field", "facet.date", or "facet.range".';
  },

/** ----------------------------------------------------------------------------
   * Used "if" it is facet.pivot data.
   *
   * * @param {JSON} as the solr output for facet.pivots.
   * @returns {Map} A map associating to each key an array of two elements (total count, and another map),
   * or the count.
   */
  getPivotCountsMap: function (property) {
    return parse_pivots(this.manager.response.facet_counts[property][this.field]);
  },

  /**
   * Used if the facet counts are represented as a JSON object.
   *
   * @param {String} property "facet_fields", "facet_dates", or "facet_ranges".
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCountsMap: function (property) {
    var counts = [];
    for (var facet in this.manager.response.facet_counts[property][this.field]) {
      counts.push({
        facet: facet,
        count: parseInt(this.manager.response.facet_counts[property][this.field][facet])
      });
    }
    return counts;
  },

  /**
   * Used if the facet counts are represented as an array of two-element arrays.
   *
   * @param {String} property "facet_fields", "facet_dates", or "facet_ranges".
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCountsArrarr: function (property) {
    var counts = [];
    for (var i = 0, l = this.manager.response.facet_counts[property][this.field].length; i < l; i++) {
      counts.push({
        facet: this.manager.response.facet_counts[property][this.field][i][0],
        count: parseInt(this.manager.response.facet_counts[property][this.field][i][1])
      });
    }
    return counts;
  },

  /**
   * Used if the facet counts are represented as a flat array.
   *
   * @param {String} property "facet_fields", "facet_dates", or "facet_ranges".
   * @returns {Array} An array of objects with the properties <tt>facet</tt> and
   * <tt>count</tt>, e.g <tt>{ facet: 'facet', count: 1 }</tt>.
   */
  getFacetCountsFlat: function (property) {
    var counts = [];
    for (var i = 0, l = this.manager.response.facet_counts[property][this.field].length; i < l; i += 2) {
      counts.push({
        facet: this.manager.response.facet_counts[property][this.field][i],
        count: parseInt(this.manager.response.facet_counts[property][this.field][i+1])
      });
    }
    return counts;
  },

  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully adds a
   *   filter query with the given value.
   */
  clickHandler: function (value) {
    var self = this, meth = this.multivalue ? 'add' : 'set';
    return function () {
      if (self[meth].call(self, value)) {
        self.doRequest();
      }
      return false;
    }
  },

  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully removes a
   *   filter query with the given value.
   */
  unclickHandler: function (value) {
    var self = this;
    return function () {
      if (self.remove(value)) {
        self.doRequest();
      }
      return false;
    }
  },

  /**
   * @param {String} value The facet value.
   * @param {Boolean} exclude Whether to exclude this fq parameter value.
   * @returns {String} An fq parameter value.
   */
  fq: function (value, exclude) {
    return (exclude ? '-' : '') + this.field + ':' + AjaxSolr.Parameter.escapeValue(value);
  }
});

/*********************************
 * Method for parsing pivots output: it works recursively such that at each level
 * which has a new pivot the ouput will indicate the counts and then the map of other results.
 * It follows the same structure than the solr ourput.
 *
 * @param {JSON} as the solr output for facet.pivots.
 * @returns {Map} A map associating to each key an array of two elements (total count, and another map),
 * or the count.
 * 
 * *********************************/
function parse_pivots(data_input){
	var output = {}
	for (var i = 0, l = data_input.length; i < l; i++) {
			if ("pivot" in data_input[i]){
					output[data_input[i]["value"]] = [data_input[i]["count"],parse_pivots(data_input[i]["pivot"])];
			} else {
					output[data_input[i]["value"]] = data_input[i]["count"];
			}
	}
	return output
}
/********************************************************/
}));
