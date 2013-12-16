(function ($) {

AjaxSolr.PyramidAges = AjaxSolr.AbstractFacetWidget.extend({

  afterRequest: function () {
	  
var self = this;
	d3.select("#pyramidAges").html("");
   var resultPivot=this.getFacetCounts();

   var female = resultPivot.F;
   var male = resultPivot.M;
   
   var femaleAges10 = [0,0,0,0,0,0,0,0,0,0];
   var maleAges10 = [0,0,0,0,0,0,0,0,0,0];
   
   var femaleAges = [];
   var femaleAges1 = [];
   var femaleAges11 = [];
   
   var maleAges = [];
   var maleAges1 = [];
   var maleAges11 = [];
   
   if (resultPivot.F !== undefined)
   {
   
   femaleAges = female[1];
	
	for (var key in femaleAges)
	{
		femaleAges1 = femaleAges[key];
		
		switch (true){
			case ((parseInt(key) >= 0) && (parseInt(key) <= 10)):
				femaleAges10[0] = femaleAges10[0] + femaleAges1;
				break;
			case ((parseInt(key) >= 11) && (parseInt(key) <= 20)):
				femaleAges10[1] = femaleAges10[1] + femaleAges1;
				break;
			case ((parseInt(key) >= 21) && (parseInt(key) <= 30)):
				femaleAges10[2] = femaleAges10[2] + femaleAges1;
				break;
			case ((parseInt(key) >= 31) && (parseInt(key) <= 40)):
				femaleAges10[3] = femaleAges10[3] + femaleAges1;
				break;
			case ((parseInt(key) >= 41) && (parseInt(key) <= 50)):
				femaleAges10[4] = femaleAges10[4] + femaleAges1;
				break;
			case ((parseInt(key) >= 51) && (parseInt(key) <= 60)):
				femaleAges10[5] = femaleAges10[5] + femaleAges1;
				break;
			case ((parseInt(key) >= 61) && (parseInt(key) <= 70)):
				femaleAges10[6] = femaleAges10[6] + femaleAges1;
				break;
			case ((parseInt(key) >= 71) && (parseInt(key) <= 80)):
				femaleAges10[7] = femaleAges10[7] + femaleAges1;
				break;
			case ((parseInt(key) >= 81) && (parseInt(key) <= 90)):
				femaleAges10[8] = femaleAges10[8] + femaleAges1;
				break;
			case (parseInt(key) >= 91):
				femaleAges10[9] = femaleAges10[9] + femaleAges1;
				break;
			}	
	}
	
}

if (resultPivot.M !== undefined)
   { 
	maleAges = male[1];
	
	for (var key in maleAges)
	{
		maleAges1 = maleAges[key];
		
		
		switch (true){
			case ((parseInt(key) >= 0) && (parseInt(key) <= 9)):
				maleAges10[0] = maleAges10[0] + maleAges1;
				break;
			case ((parseInt(key) >= 10) && (parseInt(key) <= 19)):
				maleAges10[1] = maleAges10[1] + maleAges1;
				break;
			case ((parseInt(key) >= 20) && (parseInt(key) <= 29)):
				maleAges10[2] = maleAges10[2] + maleAges1;
				break;
			case ((parseInt(key) >= 30) && (parseInt(key) <= 39)):
				maleAges10[3] = maleAges10[3] + maleAges1;
				break;
			case ((parseInt(key) >= 40) && (parseInt(key) <= 49)):
				maleAges10[4] = maleAges10[4] + maleAges1;
				break;
			case ((parseInt(key) >= 50) && (parseInt(key) <= 59)):
				maleAges10[5] = maleAges10[5] + maleAges1;
				break;
			case ((parseInt(key) >= 60) && (parseInt(key) <= 69)):
				maleAges10[6] = maleAges10[6] + maleAges1;
				break;
			case ((parseInt(key) >= 70) && (parseInt(key) <= 79)):
				maleAges10[7] = maleAges10[7] + maleAges1;
				break;
			case ((parseInt(key) >= 80) && (parseInt(key) <= 89)):
				maleAges10[8] = maleAges10[8] + maleAges1;
				break;
			case (parseInt(key) >= 90):
				maleAges10[9] = maleAges10[9] + maleAges1;
				break;
			}
	}
	
}
	
	/* edit/input your data */
var data = [
  {"sharedLabel": "90-99", "barData1": maleAges10[9], "barData2": femaleAges10[9]},
  {"sharedLabel": "80-89", "barData1": maleAges10[8], "barData2": femaleAges10[8]},
  {"sharedLabel": "70-79", "barData1": maleAges10[7], "barData2": femaleAges10[7]},
  {"sharedLabel": "60-69", "barData1": maleAges10[6], "barData2": femaleAges10[6]},
  {"sharedLabel": "50-59", "barData1": maleAges10[5], "barData2": femaleAges10[5]},
  {"sharedLabel": "40-49", "barData1": maleAges10[4], "barData2": femaleAges10[4]},
  {"sharedLabel": "30-39", "barData1": maleAges10[3], "barData2": femaleAges10[3]},
  {"sharedLabel": "20-29", "barData1": maleAges10[2], "barData2": femaleAges10[2]},
  {"sharedLabel": "10-19", "barData1": maleAges10[1], "barData2": femaleAges10[1]},
  {"sharedLabel": "0-9", "barData1": maleAges10[0], "barData2": femaleAges10[0]}
];

/* edit these settings freely */  
var w = 400,
    h = 200,
    topMargin = 15,
    labelSpace = 40,
    innerMargin = w/2+labelSpace,
    outerMargin = 15,
    gap = 2,
    dataRange = d3.max(data.map(function(d) { return Math.max(d.barData1, d.barData2) }));
    leftLabel = "Female",
    rightLabel = "Male";

/* edit with care */
var chartWidth = w - innerMargin - outerMargin,
    barWidth = h / data.length,
    yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
    total = d3.scale.linear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
    commas = d3.format(",.0f");

/* main panel */
var vis = d3.select("#pyramidAges").html("").append("svg")
    .attr("width", w)
    .attr("height", h);

/* barData1 label */
vis.append("text")
  .attr("class", "label")
  .text(leftLabel)
  .attr("x", w-innerMargin)
  .attr("y", topMargin-3)
  .attr("text-anchor", "end");

/* barData2 label */
vis.append("text")
  .attr("class", "label")
  .text(rightLabel)
  .attr("x", innerMargin)
  .attr("y", topMargin-3);

/* female bars and data labels */ 
var bar = vis.selectAll("g.bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      return "translate(0," + (yScale(i) + topMargin) + ")";
    });

var wholebar = bar.append("rect")
    .attr("width", w)
    .attr("height", barWidth-gap)
    .attr("fill", "none")
    .attr("pointer-events", "all");

var highlight = function(c) {
  return function(d, i) {
    bar.filter(function(d, j) {
      return i === j;
    }).attr("class", c);
  };
};

bar
  .on("mouseover", highlight("highlight bar"))
  .on("mouseout", highlight("bar"))
  .on("click", function (rect, bar) {
        if (self.addByField('user_age','['+ (90-(bar*10)).toString() + ' TO ' + (99-(bar*10)).toString() + ']')) {
          self.doRequest();
        }
      });

bar.append("rect")
    .attr("class", "femalebar")
    .attr("height", barWidth-gap);

bar.append("text")
    .attr("class", "femalebar")
    .attr("dx", -3)
    .attr("dy", "1em")
    .attr("text-anchor", "end");

bar.append("rect")
    .attr("class", "malebar")
    .attr("height", barWidth-gap)
    .attr("x", innerMargin);

bar.append("text")
    .attr("class", "malebar")
    .attr("dx", 3)
    .attr("dy", "1em");

/* sharedLabels */
bar.append("text")
    .attr("class", "shared")
    .attr("x", w/2)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.sharedLabel; });

d3.select("#generate").on("click", function() {
  for (var i=0; i<data.length; i++) {
    data[i].barData1 = Math.random() * dataRange;
    data[i].barData2 = Math.random() * dataRange;
  }
  refresh(data);
});

refresh(data);

function refresh(data) {
  var bars = d3.selectAll("g.bar")
      .data(data);
  bars.selectAll("rect.malebar")
    .transition()
      .attr("width", function(d) { return total(d.barData1); });
  bars.selectAll("rect.femalebar")
    .transition()
      .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace; }) 
      .attr("width", function(d) { return total(d.barData2); });

  bars.selectAll("text.malebar")
      .text(function(d) { return commas(d.barData1); })
    .transition()
      .attr("x", function(d) { return innerMargin + total(d.barData1); });
  bars.selectAll("text.femalebar")
      .text(function(d) { return commas(d.barData2); })
    .transition()
      .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace; });
}

	
	

	
	
   
      
}



});

})(jQuery);
