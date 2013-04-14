var Manager;

(function ($) {

  yepnope.paths = {
    ajaxsolr: '../..'
  };

  yepnope({
    load: ['ajaxsolr/managers/Manager.jquery.js', 'ajaxsolr/core/ParameterStore.js'],
    complete: function () {
      $(function () {
        Manager = new AjaxSolr.Manager({
          solrUrl: 'http://evolvingweb.ca/solr/reuters/'
        });
        Manager.init();
        Manager.store.addByValue('q', '*:*');
        Manager.doRequest();
      });
    }
  });

})(jQuery);
