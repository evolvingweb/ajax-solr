(function ($) {

AjaxSolr.MapQuery = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {return false;},

  facetHandler: function (facet_field, facet_value) {return false;},

  afterRequest: function () {
			var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
			cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, Points &copy 2012 LINZ',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 17, attribution: cloudmadeAttribution}),
			latlng = new L.LatLng(40.4167754, -3.7037901999999576);

		var map = new L.Map('map', {center: latlng, zoom: 7, layers: [cloudmade]});
		
		var markers = new L.MarkerClusterGroup();		

		//TODO: cargar las coordenadas de los comentarios
		
		for( var i=0; i<this.manager.response.response.docs.length; i++)
		{
			var title = this.manager.response.response.docs[i].comment_content;
			var a =this.manager.response.response.docs[i].geo_loc[0].split(",");
			var marker = new L.Marker(new L.LatLng(parseFloat(a[0]), parseFloat(a[1])), { title: title });
			marker.bindPopup(title);
			markers.addLayer(marker);
		}
		
  /*
		for (var i = 0; i < result.response.docs.length; i++) {
			//var a = addressPoints[i];
			var title = result.response.docs[i].comment_content;
			var a =result.response.docs[i].geo_loc[0].split(",");
			console.log(a);
			console.log(a[0],a[1]);
			
			var marker = new L.Marker(new L.LatLng(parseFloat(a[0]), parseFloat(a[1])), { title: title });
			marker.bindPopup(title);
			markers.addLayer(marker);
		}
*/
		map.addLayer(markers);
      
  },

  template: function (doc) {return false;},

  init: function () {return false;}
});

})(jQuery);