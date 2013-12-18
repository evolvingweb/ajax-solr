(function ($) {

AjaxSolr.HistogramWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;
  
    var maxCount = 0;
    var objectedItems = [];
    
    
    for (var facet in this.manager.response.facet_counts.facet_dates[this.fields[0]]) {
      var count = parseInt(this.manager.response.facet_counts.facet_dates[this.fields[0]][facet]);
      if (count > maxCount) {
        maxCount = count;
      }
      if (facet.substr(0,1) == '2')
      {
		objectedItems.push({ facet: facet, count: count });
	  }
    }
    
    var w = 360;
	var h = 300;
    var n;
    var s;
    var months = [];	
	var facets = [];
	var maxMonths = 12;
	var monthAct;
	var monthAnt;
	var monthAcum = 0;
	var monthAcumMax = 0;
    var facets2 = [0,0,0,0,0,0,0,0,0,0,0,0], months2 = [0,0,0,0,0,0,0,0,0,0,0,0];
    
    if (objectedItems.length > 1)
	{
		
		monthAct = objectedItems[0].facet.substr(0,7);
		monthAnt = monthAct;
		
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
				monthAnt = monthAct;
				monthAct = objectedItems[i].facet.substr(0,7);
				
				if (months.length >= 11)
				{
					break;
				}	
			}
		}
		
		facets.push(monthAcum);
		months.push(monthAct);
		
		if (monthAcumMax == 0)
		{
			monthAcumMax = monthAcum;
		}
		
		//fill the gap betweens months
		
		facets2[0] = facets[0];
		months2[0] = months[0];
		
		var lastMonth;
		var lastYear;
		
		for (var i=1; i<12; i++)
		{
			lastMonth = parseInt(months2[i-1].substr(5,2));
			lastYear = parseInt(months2[i-1].substr(0,4));
			
			if (lastMonth < 12)
			{
				if (lastMonth < 9)
				{
					months2[i] = lastYear.toString() + "-0" + (lastMonth + 1).toString();
				}
				else
				{
					months2[i] = lastYear.toString() + "-" + (lastMonth + 1).toString();
				}
			}
			else if (lastMonth > 11)
			{
				months2[i] = (lastYear + 1).toString() + "-01";
			}
		}
		
		for (var i=0; i<12; i++)
		{
			if (i < months.length)
			{
				if (months2[i] == months[i])
				{
					facets2[i] = facets[i];
				}
			}
			else
			{
				break;
			}
		}
		
		n = maxMonths;
		s = monthAcumMax/h;
			
    }
    else if (objectedItems.length == 1){
		
		var hours = [];
		var posts = [];
		monthAcumMax = 0;
		
		var testing = "";
		
		for (var facet in this.manager.response.facet_counts.facet_fields[this.fields[1]]){
			var countHour = parseInt(this.manager.response.facet_counts.facet_fields[this.fields[1]][facet]);
			hours.push(facet);
			posts.push(parseInt(countHour));
			
			if (countHour > monthAcumMax)
			{
				monthAcumMax = countHour;
			}
		}

		var hours2 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
		var posts2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

		var hourAct = 0;
		var hourAnt = -1;

		for (var i=0; i<24; i++)
		{
			for (var j=0; j<hours.length; j++)
			{
				if (hours[j] == i)
				{
					posts2[i] = posts[j];
					break;
				}
			}
		}


		n = 24;
		s = (monthAcumMax/h);
		
		facets2 = posts2;
		months2 = hours2;
			
	}
	
	if (objectedItems.length > 0)
	{
		
		//definimos el elemento svg
		var svg = d3.select("#histogram")
			.html("")
			.append("svg")
			.attr("width", w+30)
			.attr("height", h+30);
			
		//segun los datos de "facets", creamos las barras verticales	
		svg.selectAll("rect")
			.data(facets2)
			.enter()
			.append("rect")
			.attr("x", function(d, i) {return (i*((w/n)+1))+5;})
			.attr("y", function(d) {return h - (d/s);})
			.attr("width", w/n - 1)
			.attr("height", function(d) {return (d/s);})
			.attr("class", "femalebar")
			.on("mouseover", function () {d3.select(this).classed("highlight2", true);})
			.on("mouseout", function () {d3.select(this).classed("highlight2", false);})
			.on("click", function (rect, bar) {
				
				var query;
				if (objectedItems.length > 1)
				{
					if (parseInt(months2[bar].substr(5,2)) < 12)
					{
						query = '[' + months2[bar] + '-01T00:00:00Z TO ' + months2[bar+1] + '-01T00:00:00Z]';
					}
					else
					{
						query = '[' + months2[bar] + '-01T00:00:00Z TO ' + (parseInt(months2[bar].substr(0,4)) + 1) + '-01-01T00:00:00Z]'
					}
					if (self.addByField('comment_date', query)) {
							self.doRequest();
					}
				}
				else if (objectedItems.length == 1)
				{
					if (self.addByField('comment_hour', bar)) {
						self.doRequest();
					}
				}

      });
			;
		
		//dado que en months tenemos las fechas en formato yyyy-mm, mostramos 
		//un texto encima de cada barra, que dice a que fecha corresponse
		svg.selectAll("text")
			.data(months2)
			.enter()
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr("x", function(d, i) {
				return (i * ((w / n) + 1))+5;
				})
			.attr("y", function(d) {
				return h+15;
			})
			.attr("width", w/n - 1)
			.attr("fill", "green")
			.attr("font-size", "8");
			
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
	else 
	{
		var svg = d3.select("#histogram")
			.html("");
	}
	
  }
});

})(jQuery);
