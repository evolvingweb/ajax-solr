(function ($) {
var ini = false;
var markers;

AjaxSolr.MapQuery = AjaxSolr.AbstractWidget.extend({
	start: 0,
	currentGeolocQuery: null,
	gridSize: 5,
	
	init: function () {
		self= this;
		$(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
		$("#button").append("<button id='updatebutton' >Update </button>");
		//Hook for update button
		$("#button").click( function(){self._updateFunction()});
		//crear mapar
		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
			cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, Points &copy 2012 LINZ',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 17, attribution: cloudmadeAttribution}),
			latlng = new L.LatLng(37.6735925, -1.6968357000000651);
		var southWest = L.latLng(-90, -180),
			northEast = L.latLng(90, 180),
			bounds = L.latLngBounds(southWest, northEast);
		map = new L.Map('map', {center: latlng, zoom: 0, layers: [cloudmade], maxBounds: [bounds]});
	},
	
	beforeRequest: function () {

	//////////////

	////////////

	},

	facetLinks: function (facet_field, facet_values) {return false;},

	facetHandler: function (facet_field, facet_value) {return false;},

	buttonRequest: function prova(){   alert("hpl");  },

	afterRequest: function () {
		self.clusterFunction(); //funcion de Tomás
		//es torna a omplir el mapa
		//TODO: cargar las coordenadas de los comentarios
		//
		//console.log("hola");
		//markers = new L.MarkerClusterGroup();
		/*for( var i=0; i<this.manager.response.response.docs.length; i++)
		{
			var title = this.manager.response.response.docs[i].comment_content;
			var a =this.manager.response.response.docs[i].geo_loc[0].split(",");
			var marker = new L.Marker(new L.LatLng(parseFloat(a[0]), parseFloat(a[1])), { title: title });
			marker.bindPopup(title);
			markers.addLayer(marker);
		}
		
		map.addLayer(markers);
   		Manager.store.addByValue('boundingBox', map.getBounds() );*/
		//$(".leaflet-top.leaflet-right").append("<button id='update_button'> Update </button>");
	},
	
	clusterFunction: function(){ //pseudocodigo tomás
		//TODO coger lso bounds de la propia respueta porque puede ser que se haya modificado el mapa (de momento dejamos el mapa quieto)
		var coordenadas= map.getBounds();
		var coordenadas_xmin=coordenadas._southWest.lat;
		var coordenadas_xmax=coordenadas._northEast.lat;
		var coordenadas_ymin=coordenadas._southWest.lng;
		var coordenadas_ymax=coordenadas._northEast.lng;
		var objetoJsonIdentifier= "";
		objetoJsonIdentifier= map.getZoom()<5 ? "_lat_zero,_long_zero": "_lat,_long";
		//if(map.getZoom()>5){objetoJsonIdentifier="_lat_zero,_long_zero";}else{objetoJsonIdentifier="_lat,_long";}
		//Tamaño de las celdas
		var stepx= Math.abs( (coordenadas_xmin-coordenadas_xmax)/self.gridSize );
		var stepy= Math.abs( (coordenadas_ymin-coordenadas_ymax)/self.gridSize );
		//Parseo del json
		
		var objetoJson = this.manager.response.facet_counts.facet_pivot[objetoJsonIdentifier];
		markers = new L.LayerGroup();
		var countTotal=0;
		for (var i in objetoJson)
		{
			countTotal+=objetoJson[i].count;
		}
		for(var i= coordenadas_xmin; i<coordenadas_xmax;i+=stepx)
		{
		
			for(var j= coordenadas_ymin; j<coordenadas_ymax;j+=stepy)
			{
			var currentCelda=0;
			for(var Lat in objetoJson)
			{
				var latitude= objetoJson[Lat].value;
				var latitudeMaxGrilla= i+stepx
				
				if(latitude>=i && latitude< latitudeMaxGrilla)
				{
						for(var Long in objetoJson[Lat].pivot)
						{
							var longitude= objetoJson[Lat].pivot[Long];
							var longitudeMaxGrilla=j+stepy 
							if(longitude.value >=j && longitude.value<(longitudeMaxGrilla))
							{
								currentCelda+=longitude.count;
							}
						}
						
					}
				}
				
				if(currentCelda!=0)
				{
					//var marker = new L.Marker(new L.LatLng(parseFloat(i+stepx/2), parseFloat(j+stepy/2)), { title: currentCelda });
					//markers.addLayer(marker);
				    
				    var size;
				    var c = parseFloat(currentCelda)/countTotal;
				    if(c<1/3)size = "small";
				    else if(c <2/3) size = "medium";
				    else size = "large";

				    var myIcon = new L.DivIcon({ html: '<div><span>' + currentCelda + '</span></div>', className: 'leaflet-marker-icon marker-cluster marker-cluster-'+size , iconSize: new L.Point(40, 40) });
				    //markers.addLayer(marker);
				    m2=new L.Marker(new L.LatLng(parseFloat(i+stepx/2), parseFloat(j+stepy/2)), {icon: myIcon});
				    markers.addLayer(m2);
				}
			}
		}
		map.addLayer(markers);
	},

	template: function (doc) {return false;},

	_updateFunction: function(){
		//Remove current layer of markers
		map.removeLayer(markers);

		var geoLoc= map.getBounds();
		//Remove previous geo_loc filter query
		Manager.store.removeByValue('fq',self.currentGeolocQuery);
		//Add new filter query and refresh current filter query
		this.currentGeolocQuery= 'geo_loc:['+geoLoc._southWest.lat+','+geoLoc._southWest.lng+' TO '+geoLoc._northEast.lat+','+geoLoc._northEast.lng+']';
		Manager.store.addByValue('fq', self.currentGeolocQuery);
		Manager.store.remove('facet.pivot');
		if(map.getZoom()<5) Manager.store.addByValue('facet.pivot', '_lat_zero,_long_zero');
		else Manager.store.addByValue('facet.pivot', '_lat,_long');
        //Línea añadida para los facets
		Manager.doRequest();
	}
  
});

})(jQuery);
