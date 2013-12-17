(function ($) {
    var ini = false;
    var markers;

    AjaxSolr.MapQuery = AjaxSolr.AbstractWidget.extend({
	start: 0,
	currentGeolocQuery: null,
	
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
	    //Tamaño de las celdas
	    var stepx= Math.abs( (coordenadas_xmin-coordenadas_xmax)/15 );
	    var stepy= Math.abs( (coordenadas_ymin-coordenadas_ymax)/15 );
	    //Parseo del json
	    var objetoJson = this.manager.response.facet_counts.facet_pivot["_lat,_long"];
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
			//Agregar un marcador en posicion i+stepx/2 j+stepy/2 con el valor de current Celda
			var marker = new L.Marker(new L.LatLng(parseFloat(i+stepx/2), parseFloat(j+stepy/2)), { title: currentCelda });
			//marker.bindPopup(currentCelda);
			markers.addLayer(marker);
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
	    Manager.doRequest();
	}
	
    });

})(jQuery);
