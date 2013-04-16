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
    'widgets/ResultWidget.js',
    '../../widgets/jquery/PagerWidget.js'
  );

  head('Manager.jquery.js', function () {
    head('ParameterStore.js', function () {
      head('ResultWidget.js', function () {
        head('PagerWidget.js', function () {
          $(function () {
            Manager = new AjaxSolr.Manager({
              solrUrl: 'http://evolvingweb.ca/solr/reuters/'
            });
            Manager.addWidget(new AjaxSolr.ResultWidget({
              id: 'result',
              target: '#docs'
            }));
            Manager.addWidget(new AjaxSolr.PagerWidget({
              id: 'pager',
              target: '#pager',
              prevLabel: '&lt;',
              nextLabel: '&gt;',
              innerWindow: 1,
              renderHeader: function (perPage, offset, total) {
                $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
              }
            }));
            Manager.init();
            Manager.store.addByValue('q', '*:*');
            Manager.doRequest();
          });
        });
      });
    });
  });

})(jQuery);
