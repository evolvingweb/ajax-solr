var Manager;

(function ($) {

  AjaxSolrBasePath = '../../';

  $LAB.script(AjaxSolrBasePath + 'managers/Manager.jquery.js').script(AjaxSolrBasePath + 'core/ParameterStore.js').wait(function () {
    $(function () {
      Manager = new AjaxSolr.Manager({
        solrUrl: 'http://evolvingweb.ca/solr/reuters/'
      });
      Manager.init();
      Manager.store.addByValue('q', '*:*');
      Manager.doRequest();
    });
  });

})(jQuery);
