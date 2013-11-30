(function ($) {
var ini = false;

AjaxSolr.MapQuery = AjaxSolr.AbstractWidget.extend({
  start: 0,
  currentGeolocQuery: null,
  beforeRequest: function () {
	
	//////////////
	
	////////////

  },

  facetLinks: function (facet_field, facet_values) {return false;},

  facetHandler: function (facet_field, facet_value) {return false;},

  buttonRequest: function prova(){   alert("hpl");  },

  afterRequest: function () {
//es torna a omplir el mapa
			 
			

		//TODO: cargar las coordenadas de los comentarios
		//
		markers = new L.MarkerClusterGroup();
		for( var i=0; i<this.manager.response.response.docs.length; i++)
		{
			var title = this.manager.response.response.docs[i].comment_content;
			var a =this.manager.response.response.docs[i].geo_loc[0].split(",");
			var marker = new L.Marker(new L.LatLng(parseFloat(a[0]), parseFloat(a[1])), { title: title });
			marker.bindPopup(title);
			markers.addLayer(marker);
		}
		
		map.addLayer(markers);
   		Manager.store.addByValue('boundingBox', map.getBounds() );
		

		//$(".leaflet-top.leaflet-right").append("<button id='update_button'> Update </button>");

  },

  template: function (doc) {return false;},

  init: function () {
		self= this;
		$(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
		$("#button").append("<button id='updatebutton' >Update </button>");
	
		//Hook for update button
		$("#button").click( function(){
		//Manager.store.addByValue('q', '*:*');
			var geoLoc= map.getBounds();
			//http://patexpert-engine.upf.edu:8080/pbpl/collection1/select?q=*:*&fq=geo_loc:[-48,-70 TO -46,-60]&wt=json&indent=true
			//Manager.store.remove('fq');
			//Remove previous geo_loc filter query
			Manager.store.removeByValue('fq',self.currentGeolocQuery);
			//Add new filter query and refresh current filter query
			self.currentGeolocQuery= 'geo_loc:['+geoLoc._southWest.lat+','+geoLoc._southWest.lng+' TO '+geoLoc._northEast.lat+','+geoLoc._northEast.lng+']';
			Manager.store.addByValue('fq', self.currentGeolocQuery);
			//Manager.store.addByValue('fq', 'geo_loc:['+geoLoc._southWest.lat+','+geoLoc._southWest.lng+' TO '+geoLoc._northEast.lat+','+geoLoc._northEast.lng+']');
			Manager.doRequest();
		
			// borar todos los markers de leaflet porque se actualiza la búsqueda
		
		});
	//crear mapar
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
			cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, Points &copy 2012 LINZ',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 17, attribution: cloudmadeAttribution}),
			latlng = new L.LatLng(37.6735925, -1.6968357000000651);
			map = new L.Map('map', {center: latlng, zoom: 10 , layers: [cloudmade]});
	
			
	return false;}
});

})(jQuery);
