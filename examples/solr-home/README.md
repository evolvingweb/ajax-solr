This directory contains Solr configuration files for running the [Solr 4 Reuters index](http://public.slashpoundbang.com.s3.amazonaws.com/data-solr-4-index.zip) locally. The `stopwords.txt` and `synonyms.txt` are the Solr defaults. `schema.xml` and `solrconfig.xml` were trimmed down to the essentials.

## Notes on how the Solr 4 index was created

The following steps were used to convert the [Solr 1.4 Reuters index](https://github.com/downloads/evolvingweb/ajax-solr/reuters_data.tar.gz) to a [Solr 4 index](http://public.slashpoundbang.com.s3.amazonaws.com/data-solr-4-index.zip):

1. Download and install Solr 3.6, because Solr 3.6 supports Solr 1.4.x indexes.
1. Copy `schema.xml` and `solrconfig.xml` to the Solr 3.6 `conf` directory.
1. Copy the Solr 1.4 index to the Solr 3.6 `data` directory.
1. Start Solr 3.6 by running `java -jar start.jar` from the Solr 3.6 directory.
1. Optimize the index to save it in the Solr 3.6 format: `curl -X POST http://localhost:8983/update?commit=true -H "Content-Type: text/xml" --data-binary '<optimize />'`
1. Stop Solr 3.6.
1. Copy the Solr 3.6 `conf` directory to your Solr 4 directory.
1. Copy the Solr 3.6 `data` index to your Solr 4 directory.
1. Start Solr 4.

## References

* [Reuters-21578 Text Categorization Collection](http://kdd.ics.uci.edu/databases/reuters21578/reuters21578.html)
* [SolrJS wiki](http://wiki.apache.org/solr/SolrJS#Creating_the_reuters_example)
