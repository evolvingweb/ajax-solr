var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://example.solrstuff.org/solrjs/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    Manager.doRequest();
  });

})(jQuery);
