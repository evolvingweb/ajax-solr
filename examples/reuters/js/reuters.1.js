var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://example.solrstuff.org/solrjs/select',
    });
    Manager.init();
    Manager.store.addByValue('q', 'oil');
    Manager.doRequest();
  });

})(jQuery);
