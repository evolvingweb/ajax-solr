var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://example.solrstuff.org/solrjs/select',
    });
    Manager.setStore(new AjaxSolr.ParameterHashStore());

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
        $('#pager-header').html($('<span/>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
      }
    }));
    Manager.addWidget(new AjaxSolr.TagcloudWidget({
      id: 'topics',
      target: '#topics',
      field: 'topics'
    }));
    Manager.addWidget(new AjaxSolr.TagcloudWidget({
      id: 'organisations',
      target: '#organisations',
      field: 'organisations'
    }));
    Manager.addWidget(new AjaxSolr.TagcloudWidget({
      id: 'exchanges',
      target: '#exchanges',
      field: 'exchanges'
    }));
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));

    /* TODO implement widget
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'search',
      target: '#search',
      fulltextFieldName: 'allText',
      fieldNames: [
        'topics',
        'organisations',
        'exchanges'
      ]
    }));
    */
    Manager.addWidget(new AjaxSolr.CountryCodeWidget({
      id: 'countries',
      target: '#countries',
      field: 'countryCodes'
    }));
    /* TODO implement widget, convert dates to string
    Manager.addWidget(new AjaxSolr.CalendarWidget({
      id: 'calendar',
      target: '#calendar',
      field: 'date',
      minDate: new Date(1987, 01, 01),
      endDate: new Date(1987, 10, 31)
    }));
    */

    Manager.init();
  });

})(jQuery);
