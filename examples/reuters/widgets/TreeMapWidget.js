(function ($) {
        
	AjaxSolr.TreeMapWidget = AjaxSolr.AbstractFacetWidget.extend({
		
				  
		afterRequest: function () 
		{
				$(this.target).empty();
				//default values
				var width= 960;
				var height= 500;
				var margin= {top: 40,right: 10,bottom: 10,left: 10};
				var env = this;
				
				
		  
			if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
				$(this.target).html('no items found in current selection');
				return;
			}
			
				
				
				//objectedItems is my list of facets & counts
				var maxCount = 0;
				var objectedItems2 = [];
				for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
				  var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
				  if (count > maxCount) {
					maxCount = count;
				  }
				  objectedItems2.push({ name: facet, children : [{name: facet, size: count}] });
				}
				
				
				//see print values
					/*for(var i=0; i<objectedItems2.length;i++){
						document.write(objectedItems2[i].name); 
						document.write(",");
						document.write(objectedItems2[i].children[0].size);
						document.write("\n");
					}*/
				
				var json1= JSON.stringify(objectedItems2);
				//document.write(json1);
				
				var json2 = '{ "name" : "node" , "children" : ';
				json2 += json1;
				json2 += '}';
				//document.write(json2); 
				
				var width = this.width;
				var height = this.height;
				var margin = this.margin;
				

				var color = d3.scale.category20c();

				var treemap = d3.layout.treemap()
				    .size([width, height])
				    .sticky(true)
				    .value(function(d) { return d.size; });
					
				//style class to overwrite attrs = target 
				var div = d3.select(this.target).append("div")
				    .style("position", "relative")
				    .style("width", (width + margin.left + margin.right) + "px")
				    .style("height", (height + margin.top + margin.bottom) + "px")
				    .style("left", margin.left + "px")
				    .style("top", margin.top + "px");
					
				
	
				//"" is the path of the json, if gives error, it would use the root value
				d3.json("", function(error, root) {
					root=JSON.parse( json2 );
				  var node = div.datum(root).selectAll(".node")
				      .data(treemap.nodes)
				    .enter().append("div")
				      .attr("class", "node")
				      .call(position)
				      .style("background", function(d) { return d.children ? color(d.name) : null; })
				      .text(function(d) { return d.children ? null : d.name; })
					  .on("click", function(d) { //clickhandler function
						  var self = env, meth = env.multivalue ? 'add' : 'set';			
							self[meth].call(self, d.name);
							self.doRequest();
					  }); 
						  
				  d3.selectAll("input").on("change", function change() {
				    var value = this.value === "count"
					? function(d) { return 1; }
					: function(d) { return d.size; };

				    node
					.data(treemap.value(value).nodes)
				      .transition()
					.duration(1500)
					.call(position);
				  });
				 
				 
				  
				});

				function position() {
				  this.style("left", function(d) { return d.x + "px"; })
				      .style("top", function(d) { return d.y + "px"; })
				      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
				      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
				}
				
          		
		}
	});

})(jQuery);

