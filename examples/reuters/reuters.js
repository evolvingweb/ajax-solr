var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/select',
    });

    Manager.addWidget(new AjaxSolr.MyPagerWidget({
      id: 'pager',
      target: '#pager'
    }));
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#result',
      rows: 10
    }));

    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection',
    }));

    /* TODO implement widget
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'search',
      target: '#search',
      fulltextFieldName: 'allText',
      fieldNames: [
        'topics',
        'organizations',
        'exchanges'
      ]
    }));
    */
    Manager.addWidget(new AjaxSolr.TagcloudWidget({
      id: 'topics',
      target: '#topics',
      field: 'topics',
      limit: 50
    }));
    Manager.addWidget(new AjaxSolr.TagcloudWidget({
      id: 'organisations',
      target: '#organisations',
      field: 'organisations',
      limit: 20
    }));
    Manager.addWidget(new AjaxSolr.TagcloudWidget({
      id: 'exchanges',
      target: '#exchanges',
      field: 'exchanges',
      limit: 20
    }));
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
