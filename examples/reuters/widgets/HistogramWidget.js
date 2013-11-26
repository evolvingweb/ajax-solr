(function ($) {


AjaxSolr.HistogramWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;
  
    var maxCount = 0;
    var objectedItems = [];
    
    for (var facet in this.manager.response.facet_counts.facet_dates[this.field]) {
      var count = parseInt(this.manager.response.facet_counts.facet_dates[this.field][facet]);
      if (count > maxCount) {
        maxCount = count;
      }
      if (facet.substr(0,1) == '2')
      {
		objectedItems.push({ facet: facet, count: count });
	  }
    }
    
    if (objectedItems.length >= 1)
	{
		var months = [];	
		var facets = [];
		var maxMonths = 12;
		var monthAct = objectedItems[0].facet.substr(0,7);
		var monthAcum = 0;
		var monthAcumMax = 0;
		for (var i=0; i<objectedItems.length; i++)
		{
			monthAcum += objectedItems[i].count;
			if (objectedItems[i].facet.substr(0,7) > monthAct)
			{
				if (monthAcum > monthAcumMax)
				{
					monthAcumMax = monthAcum;
				}
				facets.push(monthAcum);
				monthAcum = 0;
				months.push(monthAct);
				monthAct = objectedItems[i].facet.substr(0,7);
				if (months.length >= 12)
				{
					break;
				}	
			}
		}
		
		var w = 600;
		var h = 300;
		var n = maxMonths;
		var s = parseInt(monthAcumMax/h);
		
		//definimos el elemento svg
		var svg = d3.select("#histogram")
			.html("")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
			
		//segun los datos de "facets", creamos las barras verticales	
		svg.selectAll("rect")
			.data(facets)
			.enter()
			.append("rect")
			.attr("x", function(d, i) {return i*((w/n)+1);})
			//.attr("x", function(d, i) {return i*21;})
			.attr("y", function(d) {return h - (d/s);})
			.attr("width", w/n - 1)
			.attr("height", function(d) {return (d/s);})
			.attr("fill", function(d) {
				return "rgb(0,0, " + (255) + ")";
				});
		
		//dado que en months tenemos las fechas en formato yyyy-mm, mostramos 
		//un texto encima de cada barra, que dice a que fecha corresponse
		svg.selectAll("text")
			.data(months)
			.enter()
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr("x", function(d, i) {
				return i * (w / n) + 6;
				})
			.attr("y", function(d) {
				return h*0.1;
			})
			.attr("fill", "green")
			.attr("font-size", "12");
			
			//definimos un elemento de escala de 0 al mes con el mayor número
			//de posts
		var yScale = d3.scale.linear()
			.domain([0, monthAcumMax])
			.range([h - 0, 0]);
			
			//definimos un elemento de eje, le decimos la escala que hemos
			//definido antes
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("right")
			.ticks(9);
				
			//añadimos a svg el eje que hemos definido	
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + w - 20 + ",0)")
				.call(yAxis);
			
    }
  }
});

})(jQuery);
