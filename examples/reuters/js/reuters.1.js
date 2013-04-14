var Manager;

(function ($) {

  $LAB.setGlobalDefaults({BasePath: '../../'});

  $LAB.script('managers/Manager.jquery.js').script('core/ParameterStore.js').wait(function () {
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
