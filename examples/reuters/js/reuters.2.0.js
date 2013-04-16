var Manager;

(function ($) {
  head.js(
    '../../core/Core.js',
    '../../core/Parameter.js',
    '../../core/ParameterStore.js',
    '../../core/ParameterHashStore.js',
    '../../core/AbstractManager.js',
    '../../managers/Manager.jquery.js',
    '../../core/AbstractWidget.js',
    '../../core/AbstractFacetWidget.js',
    '../../core/AbstractSpatialWidget.js',
    '../../core/AbstractSpellcheckWidget.js',
    '../../core/AbstractTextWidget.js',
    'widgets/ResultWidget.2.0.js'
  );

  head('Manager.jquery.js', function () {
    head('ParameterStore.js', function () {
      head('ResultWidget.2.0.js', function () {
        $(function () {
          Manager = new AjaxSolr.Manager({
            solrUrl: 'http://evolvingweb.ca/solr/reuters/'
          });
          Manager.addWidget(new AjaxSolr.ResultWidget({
            id: 'result',
            target: '#docs'
          }));
          Manager.init();
          Manager.store.addByValue('q', '*:*');
          Manager.doRequest();
        });
      });
    });
  });

})(jQuery);
