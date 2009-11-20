// $Id$

/**
 * Interacts with the Spatial Solr plugin.
 *
 * @see http://www.jteam.nl/news/spatialsolr
 *
 * @class AbstractSpatialWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractSpatialWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstracSpatialtWidget.prototype */
  {
  /**
   * Latitude of the center of the search area.
   *
   * @field
   * @private
   * @type Number
   */
  lat: null,

  /**
   * Longitude of the center of the search area.
   *
   * @field
   * @private
   * @type Number
   */
  lng: null,

  /**
   * Radius of the search area.
   *
   * @field
   * @private
   * @type Number
   */
  radius: null,

  /**
   * Sets the spatial local parameters.
   *
   * @param {String} lat The new latitude.
   * @param {String} lng The new longitude.
   * @param {String} radius The new radius.
   */
  set: function (lat, lng, radius) {
    this.manager.store.get('q').local('type', 'spatial');
    this.manager.store.get('q').local('lat', lat);
    this.manager.store.get('q').local('long', lng);
    this.manager.store.get('q').local('radius', radius);
  },

  /**
   * Removes the spatial local parameters.
   */
  clear: function () {
    this.manager.store.get('q').delete('type');
    this.manager.store.get('q').delete('lat');
    this.manager.store.get('q').delete('long');
    this.manager.store.get('q').delete('radius');
  }
});
