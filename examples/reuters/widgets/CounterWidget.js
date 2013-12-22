(function ($) {

AjaxSolr.CounterWidget = AjaxSolr.AbstractWidget.extend({
  afterRequest: function () {
    $(this.target).append($('<meta charset="utf-8"><style>body {  font: 10px sans-serif;}.axis path,.axis line {  fill: none;  stroke: #000;  shape-rendering: crispEdges;}.x.axis path {  display: none;}.line {  fill: none;  stroke: steelblue;  stroke-width: 1.5px;}</style>'));

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960/2.5 - margin.left - margin.right,
    height = 500/2.5 - margin.top - margin.bottom;


var x = d3.time.scale()
    .range([0, width]);


var parseDate = d3.time.format("%Y%m%d").parse;

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.freq); });

var svg = d3.select("#counter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data5.tsv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var words = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, freq: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(words, function(c) { return d3.min(c.values, function(v) { return v.freq; }); }),
    d3.max(words, function(c) { return d3.max(c.values, function(v) { return v.freq; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  var word = svg.selectAll(".word")
      .data(words)
    .enter().append("g")
      .attr("class", "word");

  word.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  word.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.freq) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
});

  }
});

})(jQuery);
