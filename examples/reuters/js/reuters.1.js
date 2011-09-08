var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://evolvingweb.ca/solr/reuters/'
    });
    Manager.store.addByValue('q', '*:*');
    Manager.init();
    Manager.doRequest();
  });

})(jQuery);
