(function ($) {

AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
  

afterRequest: function () {
     var links = [],
     selected = [],
     unselected = [] 

   if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
      $(this.target).html('no items found in current selection');

      return;
    }


    var maxCount = 0;
    var objectedItems = [];
    for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
      var count = this.manager.response.facet_counts.facet_fields[this.field][facet];
      if (this.manager.store.find('fq', new RegExp (this.fq(facet)))) {
	selected.push({
		facet: facet,
		field: this.field,
		count: count
	});
      } else if(facet) {
	unselected.push({
                  facet: facet,
                  field: this.field,
                  count: count
      	});
      }

      objectedItems.push(
	{
	  facet: facet, 
	  count: count 
	});

    }

	$(this.target).empty();
	 var output = [];
	 var i = 0;
	 for (facet in this.manager.response.facet_counts.facet_fields[this.field]) {   
		output[i] = this.manager.response.facet_counts.facet_fields[this.field][facet];
		i++;
	 }
	
	unselected = output;
	
	//Selected items. It will be shown in checkbox
	for (var i = 0, l = selected.length; i < l; i++) {
	 var facet = selected[i].facet;
	 var count = selected[i].count;
	 
	    $(this.target).append(
	     $('<input id="a-'+facet+'" class="tagcloud_item" type="checkbox" checked="checked" name="a-'+facet+'" value="'+facet+'" >'+facet+ '<br>')
	     .text(facet).click(this.unclickHandler(facet, this.field))  
		);	  
	 }


	for (var i = 0, l = unselected.length-1; i < l; i++) {
		var facet = unselected[i].facet;
		var value = unselected[i];
		var count = unselected[i+1];
		
		if(i % 2 == 0) {
			$(this.target).append(
			     $('<input id="propertytype-'+i+'" class="tagcloud_item" type="checkbox" name="propertytype-'+i+'" value="'+value+'" >'+value+ ' (' +count+ ') ' + '<br>')
			     .text(value+'('+ count +')')
			     .click(this.clickHandler(value))  
			       );	
		} 
	}
  }


}
);

})(jQuery);
