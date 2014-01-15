(function ($) {
        
	AjaxSolr.BubbleChartWidget = AjaxSolr.AbstractFacetWidget.extend({
		afterRequest: function () 
		{
            $(this.target).empty();
			//default values
	        var diameter = 960;
			var padding = 1.5;
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
				
				//adding root
				var json2 = '{ "name" : "node" , "children" : ';
				json2 += json1;
				json2 += '}';
				//document.write(json2); 
				
				  diameter = this.diameter;
				  padding = this.padding;
				var format = d3.format(",d");
				var color = d3.scale.category20c();

				var bubble = d3.layout.pack()
					.sort(null)
					.size([diameter, diameter])
					.padding(padding);

				var svg = d3.select(this.target).append("svg")
					.attr("width", diameter)
					.attr("height", diameter)
					.attr("class", "bubble");
				
				
				d3.json("", function(error, root) {
					root=JSON.parse( json2 );
				  var node = svg.selectAll(".node")
					  .data(bubble.nodes(classes(root))
					  .filter(function(d) { return !d.children; }))
					.enter().append("g")
					  .attr("class", "node")
					  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				
				  node.append("title")
					  .text(function(d) { return d.className + ": " + format(d.value); });
						
						
				  node.append("circle")
					  .attr("r", function(d) { return d.r; })
					  .style("fill", function(d) { return color(d.packageName); });

				  node.append("text")
					  .attr("dy", ".3em")
					  .style("text-anchor", "middle")
					  .text(function(d) { return d.className.substring(0, d.r / 3); })
					  .on("click", function(d) { //clickhandler function
						  var self = env, meth = env.multivalue ? 'add' : 'set';			
							self[meth].call(self, d.className);
							self.doRequest();
					   }); 
					  
				});

				// Returns a flattened hierarchy containing all leaf nodes under the root.
				function classes(root) {
				  var classes = [];

				  function recurse(name, node) {
					if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
					else classes.push({packageName: name, className: node.name, value: node.size});
				  }

				  recurse(null, root);
				  return {children: classes};
				}

				d3.select(self.frameElement).style("height", diameter + "px");
				
				//$(this.target).empty();
				
				
			
		}
		
		
	});
	
})(jQuery);

