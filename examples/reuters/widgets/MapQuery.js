(function ($) {
    var ini = false;

    AjaxSolr.MapQuery = AjaxSolr.AbstractWidget.extend({
	currentGeolocQuery: null,
	currentMarkers: null,
	gridSize: 5,
	zoomThreshold: 5,
	
	init: function () {
	    self= this;
	    $(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
	    //Update button
	    $("#button").append("<button id='updatebutton' >Update </button>");
	    $("#button").click( function(){self._updateFunction()});
	    //Leaflet map
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
	    //Remove current layer of markers if we find
	    if ( self.currentMarkers )
	    {
		map.removeLayer(self.currentMarkers);
	    }
	},

	facetLinks: function (facet_field, facet_values) {return false;},

	facetHandler: function (facet_field, facet_value) {return false;},

	buttonRequest: function prova(){   alert("hpl");  },

	afterRequest: function () {
	    self._gridPivot(); 
	},
	
	template: function (doc) {return false;},
	
	//Function that put the markers on the map
	_gridPivot: function(){ 
	    //Map bounds
	    var coordenadas= map.getBounds();
	    var coordenadas_xmin=coordenadas._southWest.lat;
	    var coordenadas_xmax=coordenadas._northEast.lat;
	    var coordenadas_ymin=coordenadas._southWest.lng;
	    var coordenadas_ymax=coordenadas._northEast.lng;
	    var jsonIdentifier= "";
	    jsonIdentifier= map.getZoom()<self.zoomThreshold ? "_lat_zero,_long_zero": "_lat,_long";
	    //Grid size
	    var stepx= Math.abs( (coordenadas_xmin-coordenadas_xmax)/self.gridSize );
	    var stepy= Math.abs( (coordenadas_ymin-coordenadas_ymax)/self.gridSize );
	    var objetoJson = this.manager.response.facet_counts.facet_pivot[jsonIdentifier];
	    self.currentMarkers = new L.LayerGroup();
	    var countTotal=0;
	    //Total of pivots 
	    for (var i in objetoJson)
	    {
		countTotal+=objetoJson[i].count;
	    }
	    //Calculation of pivots for every cell of the grid
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
		    //If there are any document in this cell...
		    if(currentCelda!=0)
		    {	    
			//Different colors for different weight related to the total
			var size;
			var c = parseFloat(currentCelda)/countTotal;
			if(c<1/3)size = "small";
			else if(c <2/3) size = "medium";
			else size = "large";
			//Insert marker at grid's center
			var myIcon = new L.DivIcon({ html: '<div><span>' + currentCelda + '</span></div>', className: 'leaflet-marker-icon marker-cluster marker-cluster-'+size , iconSize: new L.Point(40, 40) });
			m2=new L.Marker(new L.LatLng(parseFloat(i+stepx/2), parseFloat(j+stepy/2)), {icon: myIcon, title: currentCelda});
			self.currentMarkers.addLayer(m2);
		    }
		}
	    }
	    map.addLayer(self.currentMarkers);
	},
	//Called when we click the updateButton
	_updateFunction: function(){
	    var geoLoc= map.getBounds();
	    //Remove previous geo_loc filter query
	    Manager.store.removeByValue('fq',self.currentGeolocQuery);
	    //Add new filter query and refresh current filter query
	    this.currentGeolocQuery= 'geo_loc:['+geoLoc._southWest.lat+','+geoLoc._southWest.lng+' TO '+geoLoc._northEast.lat+','+geoLoc._northEast.lng+']';
	    Manager.store.addByValue('fq', self.currentGeolocQuery);
	    //Different request for different levels of zoom, round at solr
	    Manager.store.remove('facet.pivot');
	    if(map.getZoom()<self.zoomThreshold) Manager.store.addByValue('facet.pivot', '_lat_zero,_long_zero');
	    else Manager.store.addByValue('facet.pivot', '_lat,_long');
	    Manager.doRequest();
	}
	
    });

})(jQuery);
