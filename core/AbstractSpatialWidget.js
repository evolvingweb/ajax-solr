// $Id$

/**
 * Implements the Spatial Solr plugin.
 * @see http://www.jteam.nl/news/spatialsolr
 *
 * @class AbstractSpatialWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractSpatialWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstractWidget.prototype */
  {
  /**
   * Latitude of the centre of the search area.
   *
   * @field
   * @public
   * @type Number
   */
  lat: null,

  /**
   * Longitude of the centre of the search area.
   *
   * @field
   * @public
   * @type Number
   */
  lng: null,

  /**
   * Radius of the search area.
   *
   * @field
   * @public
   * @type Number
   */
  radius: null,

  /**
   * Unit the distances should be calulcated in: "km" or "miles".
   *
   * @field
   * @public
   * @type String
   * @default "unit"
   */
  unit: 'miles',

  /**
   * <tt>GeoDistanceCalculator</tt> that will be used to calculate the distances:
   * "arc" for <tt>ArchGeoDistanceCalculator</tt>;
   * "plane" for <tt>PlaneGeoDistanceCalculator</tt>.
   *
   * @field
   * @public
   * @type String
   * @default "arc"
   */
  calc: 'arc',

  /**
   * Number of threads that will be used by the <tt>ThreadedDistanceFilter</tt>.
   *
   * @field
   * @public
   * @type Number
   * @default 1
   */
  threadCount: 1,

  /**
   * Sets the spatial parameters to the given values.
   *
   * @param {String} q The new spatial parameter values.
   * @returns {Boolean} Whether the selection changed.
   */
  set: function (lat, lng, radius) {
    return this.changeSelection(function () {
      this.lat = lat;
      this.lng = lng;
      this.radius = radius;
    });
  },

  /**
   * Sets the spatial parameters to null.
   *
   * @returns {Boolean} Whether the selection changed.
   */
  clear: function () {
    return this.changeSelection(function () {
      this.lat = null;
      this.lng = null;
      this.radius = null;
    });
  },

  /**
   * Helper for selection functions.
   *
   * @param {Function} Selection function to call.
   * @returns {Boolean} Whether the selection changed.
   */
  changeSelection: function (func) {
    var startLat = this.lat, startLng = this.lng, startRadius = this.radius;
    func.apply(this);
    if (this.lat !== startLat || this.lng != startLng || this.radius != startRadius) {
      this.afterChangeSelection();
    }
    return this.lat !== startLat || this.lng != startLng || this.radius != startRadius;
  },

  /**
   * An abstract hook for child implementations.
   * This method is executed after the main Solr query changes.
   */
  afterChangeSelection: function () {},

  alterQuery: function (queryObj) {
    if (this.lat && this.lng && this.radius) {
      queryObj.localParams.q.type        = 'spatial';
      queryObj.localParams.q.lat         = this.lat;
      queryObj.localParams.q.long        = this.lng;
      queryObj.localParams.q.radius      = this.radius;
      queryObj.localParams.q.calc        = this.calc;
      queryObj.localParams.q.threadCount = this.threadCount;
    }
  }
});
