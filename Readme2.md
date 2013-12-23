What GeoMapGrid is about?
---

This widget shows little markers in a world map related to the geolocation info of the elements found and shows its quantity. The size and color of the markers is related to the number of elements.

The widget is meant for use with the [AJAX-solr](https://github.com/evolvingweb/ajax-solr) project. Inheriting the AbstractWidget class our widget uses [Leaflet.js](http://leafletjs.com/) to show markers on a [OpenStreetMap](http://www.openstreetmap.org/) world map.
Initially we thought of using GoogleMaps but we ended up using OSM due to its open data license (fitting given that we’re doing this as a free software course assignment).

Prerequisites
---
To use GeoMapGrid you need:  

* Solr (we used stable version 4.5.1)
* AJAX-Solr (forked, last official commit 866fcd1901d9867b678277a9c5cdaf93c6196246)
* Browser (we used latest stable versions of Firefox and Chromium corresponding to date 2013-12-23)
* jQuery (we used Jquery 2.0.3)


How to install
---

The installation is quite easy:  
First you have to add the widget on the AJAX-solr Manager like in the following:  

```
Manager.addWidget(new AjaxSolr.GeoMapGrid({
            id: 'map',
            target: '#map',
            _lat: ['_lat_zero','_lat'],
            _long: ['_long_zero','_long'],
            geo_loc: ['geo_loc'],
            gridSize: 5,
            zoomThreshold: 5,
        }));
```

You have to set the variable names, you can use the same in solr, or different, but the variable has to be the same. 
You have to provide ip for the solr instance and collection: for example, 
solrUrl: 'http://1.2.3.4:8080/solr/collection1/' the solr must index files as:

geo_loc, latitude and longitude of the type: string like: "41.981795,2.823699" we get this from our database with (latitude and longitude are geopoints): SELECT CAST( CONCAT( X( geo_pt ) , ',', Y( geo_pt ) ) AS CHAR ) as geo_loc
_lat_zero (_lat[0]), _long_zero (_long[0]) are latitude and longitude of type int
_lat (_lat[1]), _long (_long[1]) that are latitude and longitude of type double/float
Also, you can change the default valued: gridSize (number of grid subdivisions) and zoomThreshold (zoom where we change from integer values to double values in the facet query)


How to use
---

The widget consist of two filters:

* At every moment you can geolocalize comments with a particular search for words. Enter words and press enter.
* Also, with OSM interface you can navigate the map. Press update to do a geolocalization filter with the current bounds of the map

After applying this filters it will appear in “current selection”, only can be found a filter of every type (by word and geofilter). New filter replace the last of the same type. Also you can delete one of the two filters (press X in the current selection part)
