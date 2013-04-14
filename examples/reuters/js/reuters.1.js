var Manager;

(function ($) {
  head.js('../../managers/Manager.jquery.js', '../../core/ParameterStore.js', function () {
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
