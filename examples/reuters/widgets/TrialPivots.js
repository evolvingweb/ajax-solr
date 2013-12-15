(function ($) {

AjaxSolr.TrialPivots = AjaxSolr.AbstractFacetWidget.extend({
	afterRequest: function () {
	var result=this.getFacetCounts();
	}
});

})(jQuery);
