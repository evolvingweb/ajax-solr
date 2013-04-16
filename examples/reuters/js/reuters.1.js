var Manager;

require.config({
  paths: {
    core: '../../../core',
    managers: '../../../managers',
    widgets: '../../../widgets',
    reuters: '../widgets'
  },
  urlArgs: "bust=" +  (new Date()).getTime()
});

define(['managers/Manager.jquery', 'core/ParameterStore'], function () {
  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://evolvingweb.ca/solr/reuters/'
    });
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    Manager.doRequest();
  });
});
