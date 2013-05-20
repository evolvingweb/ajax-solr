This is a basic Solr Home configuration for testing the reuters index locally.

The stopwords.txt and synonyms.txt are taken from the default Solr example.
schema.xml and solrconfig.xml uses almost only the essential parts (i have removed the handler for the updates too)

The data-solr-4-index.zip contains the updated data directory needed to run Solr 4.* with these configurations.


NOTE: the index has been converted from the old one by following these steps:
1) download and install Solr 3.6 with the old index
This version supports old 1.4.* indexes, so:
	* put the example /conf/schema.xml, /conf/solrconfig.xml in the /solr/example/solr/conf directory
	* copy the /data containing the old index under /solr/example/data
	* start Solr 3.6.*:
	>> cd .../solr/example
	>> java -jar start.jar
	* optimize the Solr index, so Solr save it again using the 3.6.* format
	>> curl -X POST http://localhost:8983/update?commit=true -H "Content-Type: text/xml" --data-binary '<optimize />'
	* stop Solr 3.6.*
2) run Solr 4.* on the new index
	* copy /conf to your Solr Home
	* copy the new /data index to the Solr Home