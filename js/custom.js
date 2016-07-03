var graph_svg_width_percentage = "45%",
    graph_svg_height_percentage = "100%";

var name_svg_width_percentage = "23%",
    name_svg_height_percentage = "100%";

var packet_svg_width_percentage = "25%",
    packet_svg_height_percentage = "100%";


//for force in graph svg
var force_width = 750,
    force_height = 500;

//node radius and link width
var var_node_radius = 6;
var var_link_width = 3;

var color = d3.scale.category20();


//force width and height need to be manually configured
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(200)
    .size([force_width, force_height]);

var legend_svg = d3.select("#legend").append("svg")
    .attr("class","legend-svg")
    .attr("width", 80)
    .attr("height", 600)

var graph_svg = d3.select("#topology").append("svg")
    .attr("class","graph-svg")
    .attr("width", 1000)
    .attr("height", 600);

var fixedNodes = [];

d3.json("data/6nodes.json", function(error, graph) {

  if (error) throw error;

  //force
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  force.on("tick", tick);

  link
  var link = graph_svg.selectAll(".graph-link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "graph-link")
    .attr("id", function(d){ return d.name; })
    .style("stroke-width", var_link_width)
    .on("click",link_click);

  //drag listener
  var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

  function dragstart(d, i) {
          force.stop() // stops the force auto positioning before you start dragging
  }

  function dragmove(d, i) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      tick(); // this is the key to make it work together with updating both px,py,x,y on d !
  }

  function dragend(d, i) {
      fixedNodes.push(d)
      d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
      tick();
      force.resume();
  }

  //nodes
  var node = graph_svg.selectAll(".graph-node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "graph-node")
      .call(node_drag);

  node.append("circle")
      .attr("r",var_node_radius)
      .style("fill", function(d) { return color(d.group); });

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  };


});

//control panel

//reset Graph so that fixed nodes are free, back to force control
function resetGraph() {
  for (index = 0; index < fixedNodes.length; index++) {
    fixedNodes[index].fixed = false;
  }
  force.start()
}

//control parameters
d3.select("#bigger").on("click",radius_bigger);
d3.select("#smaller").on("click",radius_smaller);
d3.select("#thicker").on("click",link_thicker);
d3.select("#thinner").on("click",link_thinner);

function radius_bigger(){
  if (var_node_radius < 16) var_node_radius = var_node_radius + 1;
  d3.selectAll("circle").attr("r",var_node_radius);
}
function radius_smaller(){
  if (var_node_radius > 5) var_node_radius = var_node_radius - 1;
  d3.selectAll("circle").attr("r",var_node_radius);
}

function link_thicker(){
  if (var_link_width < 9) var_link_width = var_link_width + 1;
  d3.selectAll("line").style("stroke-width", var_link_width);
}
function link_thinner(){
  if (var_link_width > 1) var_link_width = var_link_width - 1;
  d3.selectAll("line").style("stroke-width", var_link_width);
}


//for svgs
var name_svg_margin = {top: 30, right: 20, bottom: 30, left: 10},
    name_svg_width = 200 - name_svg_margin.left - name_svg_margin.right,
    name_svg_barHeight = 20,
    name_svg_barWidth = name_svg_width * .3;

var packet_svg_margin = {top: 30, right: 20, bottom: 30, left: 10},
    packet_svg_width = 200 - packet_svg_margin.left - packet_svg_margin.right,
    packet_svg_barHeight = 20,
    packet_svg_barWidth = packet_svg_width * .3;

var timeline_svg_margin = {top: 50, right: 60, bottom: 80, left: 20},
    timeline_svg_width = 700,
    timeline_svg_height = 200;

var details_svg_margin = {top: 15, right: 20, bottom: 30, left: 15},
    details_svg_width = 200 - details_svg_margin.left - details_svg_margin.right,
    details_svg_barHeight = 80;

var i = 0,
    duration = 400,
    root;

var tree = d3.layout.tree()
    .nodeSize([0, 20]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

// define svgs
var name_svg = d3.select("#name").append("svg")
    .attr("class","name-svg")
    .attr("width", 500)
    .attr("height", 1000)
  .append("g")
    .attr("transform", "translate(" + name_svg_margin.left + "," + name_svg_margin.top + ")");

var packet_svg = d3.select("#packet").append("svg")
    .attr("class","packet-svg")
    .attr("width", 500)
    .attr("height", 1000 )
    .append("g")
    .attr("transform", "translate(" + packet_svg_margin.left + "," + packet_svg_margin.top + ")");

var timeline_svg = d3.select("#timeline").append("svg")
    .attr("class","timeline-svg")
    .attr("width", timeline_svg_width)
    .attr("height", timeline_svg_height )
    .append("g")
    .attr("transform", "translate(" + timeline_svg_margin.left + "," + timeline_svg_margin.top + ")");

var details_svg = d3.select("#details").append("svg")
    .attr("class","details-svg")
    .attr("width", 550)
    .attr("height", 550)
    .append("g")
    .attr("transform", "translate(" + details_svg_margin.left + "," + details_svg_margin.top + ")");

var chosen_node_details = [];

var packet_x_scale = d3.scale.linear();

function moveChildren(node) {
  node.expanded = false;
  if(node.children) {
      node.children.forEach(function(c) { moveChildren(c); });

      if (node._children) {
          node._children = node._children.concat(node.children);
      } else {
          node._children = node.children;
      }

      // node._children = node.children;
      node.children = null;
  }
}

//color1 is for the color scale of links
var color1 = d3.scale.linear().domain([0,15000]).range(['#f03b20', '#ffeda0']);
var ROY_range = d3.scale.linear().domain([0,200]).range(['#f03b20', '#ffeda0']);
var legend_data = [];
var yLegendScale = d3.scale.linear().domain([15000,0]).range([0,200]);
var yLegendAxis = d3.svg.axis().scale(yLegendScale);

d3.json("data/ndndump-best-route.json", function(error, json) {
  if (error) throw error;

  json.x0 = 10;
  json.y0 = 30;
  moveChildren(json);
  update(root = json);
  packet_x_scale = d3.scale.linear()
                     .domain([0,root.counter])
                     .range([0,300*0.3]);
  var max = 0;
  for (var k in root.links) {
    if (root.links[k] > max){
        max = root.links[k];
    }
  }
  color1 = d3.scale.linear().domain([0,max]).range(['#ffeda0','#f03b20']);
  yLegendScale = d3.scale.linear().domain([max,0]).range([0,200]);
  yLegendAxis = d3.svg.axis().scale(yLegendScale);

  for (var i=1; i<=200; ++i) {legend_data.push(i);}

  d3.select(".legend-svg")
      .selectAll("rect")
      .data(legend_data)
      .enter()
      .append("rect")
      .attr("fill",function(d){return ROY_range(d)})
      .attr("fill-opacity",0.8)
      .attr("width", 15)
      .attr("height", 1)
      .attr("x", 50)
      .attr("y", function(d){return d+100;} );

  //ticks of color legend

  yLegendAxis.orient('left')

  d3.select(".legend-svg") // or something else that selects the SVG element in your visualizations
      .append("g") // create a group node
      .attr("transform", "translate(50, 101)")
      .call(yLegendAxis); // call the axis generator

  update(root);

});

function update(source) {
  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  var nodes = tree.nodes(root);

  var height = Math.max(500, nodes.length * name_svg_barHeight + name_svg_margin.top + name_svg_margin.bottom);

  d3.select(".name-svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(".packet-svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(".details-svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

  // Compute the "layout".
  nodes.forEach(function(n, i) {
    n.x = i * name_svg_barHeight;
  });

  // Update the nodes…
  var node = name_svg.selectAll("g.name-tree-node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var packet_node = packet_svg.selectAll("g.packet-node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var details_node = details_svg.selectAll("g.details-node")
      .data(chosen_node_details);

  var nodeEnter = node.enter().append("g")
      .attr("class", "name-tree-node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);

  var pakcetNodeEnter = packet_node.enter().append("g")
      .attr("class", "packet-node")
      .attr("transform", function(d) { return "translate(" + 0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);

  var detailsNodeEnter = details_node.enter().append("g")
      .attr("class", "details-node")
      .attr("transform", function(d,i) { var x=i*details_svg_barHeight;
        return "translate(" + 0 + "," + x + ")"; })
      .style("opacity", 1e-6);

  //update timeline section
 //  var timeline_x_min,
 //      timeline_x_max;

 //  if (chosen_node_details.length){
 //    timeline_x_min = chosen_node_details[0].timestamp;
 //    timeline_x_max = chosen_node_details[0].timestamp;
 //    for (each in chosen_node_details) {
 //      timeline_x_min = Math.min(chosen_node_details[each].timestamp, timeline_x_min);
 //      timeline_x_max = Math.max(chosen_node_details[each].timestamp, timeline_x_max);
 //    }


 //  var timeline_x = d3.scale.linear()
 //          .domain([timeline_x_min-1, timeline_x_max+1])
 //          .range([ 0, timeline_svg_width - timeline_svg_margin.left - timeline_svg_margin.right ]);

 //  var timeline_y = d3.scale.linear()
 //          .domain([0, 2])
 //          .range([timeline_svg_height-timeline_svg_margin.bottom, 0]);

 // // draw the x axis
 //  var timeline_xAxis = d3.svg.axis()
 //  .scale(timeline_x)
 //  .orient('bottom');

 //  timeline_svg.append('g')
 //  .attr('transform', 'translate(20,' + (timeline_svg_height-timeline_svg_margin.bottom) + ')')
 //  .attr('class', 'main axis date')
 //  .call(timeline_xAxis);

 //  // draw the y axis
 //  var timeline_yAxis = d3.svg.axis()
 //  .scale(timeline_y)
 //  .orient('left');

 //  timeline_svg.append('g')
 //  .attr('transform', 'translate(20,0)')
 //  .attr('class', 'main axis date')
 //  .call(timeline_yAxis);

 //  var g = timeline_svg.append("g")
 //          .attr('transform', 'translate(20,0)');

 //  g.selectAll("scatter-dots")
 //    .data(chosen_node_details)
 //    .enter()
 //    .append("svg:circle")
 //    .attr("cx", function (d,i) { return timeline_x(d.timestamp); } )
 //    .attr("cy", timeline_y(1))
 //    .attr("r", 4.5);

 //  } else {
 //    timeline_x_min = 0;
 //    timeline_x_max = 1;
 //  }

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
      .attr("y", -name_svg_barHeight / 2)
      .attr("height", name_svg_barHeight)
      .attr("width", name_svg_barWidth)
      .attr("class", "name-rect")
      // .attr("transform", function(d) { return "translate(" + name_svg_barWidth/10 + "," + 0 + ")"; })
      .attr("chosen", false)
      .style("fill", name_color)
      .on("click", name_click);

  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      // .attr("transform", function(d) { return "translate(" + name_svg_barWidth/10 + "," + 0 + ")"; })
      .text(function(d) { return d.componentName; });

  //for packet svg nodes
  pakcetNodeEnter.append("rect")
      .attr("y", -packet_svg_barHeight / 2)
      .attr("height", packet_svg_barHeight)
      .attr("width", function(d){
        return packet_x_scale(d.counter);
      })
      .attr("class", "packet-rect")
      // .attr("transform", function(d) { return "translate(" + packet_svg_barWidth/10 + "," + 0 + ")"; })
      .attr("chosen", false)
      .style("fill", packet_rect_color)
      .on("click", packet_click)
      .on("mouseover", packet_mouseover)
      .on("mouseout", packet_mouseout);

  pakcetNodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      // .attr("transform", function(d) { return "translate(" + name_svg_barWidth/10 + "," + 0 + ")"; })
      .text(function(d) { return d.entireName; })
      .attr("class", "packet-text")
      .attr("chosen", false)
      .style("fill", packet_text_color)
      .on("click", packet_click)
      .on("mouseover", packet_mouseover)
      .on("mouseout", packet_mouseout);

  // for details svg nodes
  detailsNodeEnter.append("text")
      // .attr("dy", 3.5)
      // .attr("dx", 5.5)
      .each(function (d,i) {
          d3.select(this).append("tspan")
            .text(function(d) { var result = (i+1).toString()+" Type: "+d.type;
                  return result;});

         d3.select(this).append("tspan")
           .attr("x","15px")
           .attr("y","15px")
           .text(function(d) { var result = "Name: "+d.entireName;
              return result;});

          d3.select(this).append("tspan")
            .attr("x","15px")
            .attr("y","30px")
            .text(function(d,i) { var result = "Timestamp: "+d.timestamp;
                  return result;});

          d3.select(this).append("tspan")
            .attr("x","15px")
            .attr("y","45px")
            .text(function(d,i) { var result = "Link: "+d.link;
                  return result;});
          if (d.info){
            d3.select(this).append("tspan")
            .attr("x","15px")
            .attr("y","60px")
            .text(function(d,i) { var result = "More info: "+d.info;
                  return result;});
          }
      });


  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
      .select(".name-rect")
      .style("fill", name_color);

  pakcetNodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + 0 + "," + d.x + ")"; })
      .style("opacity", 1);

  packet_node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + 0 + "," + d.x + ")"; })
      .style("opacity", 1)
      .select(".packet-rect")
      .attr("width", function(d){
        return packet_x_scale(d.counter);
      })
      .style("fill", packet_rect_color);

  packet_node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + 0 + "," + d.x + ")"; })
      .style("opacity", 1)
      .select(".packet-text")
      .style("fill", packet_text_color);

  detailsNodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d,i) { var x=i*details_svg_barHeight;
        return "translate(" + 0 + "," + x + ")"; })
      .style("opacity", 1)
      .select(".details-text")

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();

  packet_node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + 0 + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();

  details_node.exit().transition()
      .duration(duration)
      .attr("transform", function(d,i) { var x=i*details_svg_barHeight;
        return "translate(" + 0 + "," + x + ")"; })
      .style("opacity", 1e-6)
      .remove();

  // Update the links…
  var link = name_svg.selectAll("path.name-tree-link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "name-tree-link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};

        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

}
// Toggle children on name-rect click.
function name_click(d){
  // console.log(d);

  if (d._children) {
    if (d.expanded) {
      //expanded then collapse
        d._children = d._children.concat(d.children);
        d.children = null;
        d.expanded = false;
    } else {
      d.expanded = true;
      //expand
      // if (chosen_links.length) {
      //     //filter with chosen links before expanding
      //     console.log(chosen_links);
      //     d._children.forEach( function(child){
      //         console.log(child);
      //         //for each child
      //         var isFound = true;
      //         chosen_links.forEach(function(d) {
      //           console.log(d);
      //           console.log(child.links[d]);
      //           if (child.links[d] == undefined) {isFound = false;}
      //         })

      //         if (isFound) {
      //           console.log(d);
      //           if (d.children) {d.children.push(child);}
      //           else {d.children = [];d.children.push(child);}
      //           d._children.pop(child);
      //         }
      //     });
      // } else {
          //expand all
          d.children = d._children;
          d._children = [];
      // }
    }
  }
  update(d);

 // d3.selectAll(".control-text")
 //  .text(function(d){
 //    return d.children ? "-" : d._children? "+" : " ";
 //  });
}

var link_data_file_name = {
  'A-B' : 1,
  'B-C' : 10,
  'B-D' : 100,
  'B-E' : 1000,
  'C-F' : 10000,
  'D-F' : 100000,
  'E-F' : 1000000
}

var chosen_links = [];
// actions in terms of link clicking
function link_click(d) {
  if (d.chosen) {
    chosen_links.pop(d.name);
    d.chosen = false;
    d3.select("#"+d.name)
    .style("stroke-width",3);
  } else {
    d.chosen = true;
    if (chosen_links.indexOf(d.name) == -1){
      chosen_links.push(d.name);
    }
    d3.select("#"+d.name)
    .style("stroke-width",12);
  }
  inputFileName = 0;
  chosen_links.forEach(function(d){
      inputFileName += link_data_file_name[d];
  });
  if (inputFileName == 0) {inputFileName=1111111;}
  inputFileName = inputFileName+'.ndndump';
  // console.log(inputFileName);

  d3.json("data/best-route-mnndn/ndndump-json/"+inputFileName, function(error, json) {
      if (error) throw error;

      json.x0 = 10;
      json.y0 = 30;
      moveChildren(json);
      update(root = json);
      packet_x_scale = d3.scale.linear()
                         .domain([0,root.counter])
                         .range([0,300]);
      var max = 0;
      for (var k in root.links) {
        if (root.links[k] > max){
            max = root.links[k];
        }
      }
      color1 = d3.scale.linear().domain([0,max]).range(['#ffeda0','#f03b20']);
      yLegendScale = d3.scale.linear().domain([max,0]).range([0,200]);
      yLegendAxis = d3.svg.axis().scale(yLegendScale);

      for (var i=1; i<=200; ++i) {legend_data.push(i);}

      d3.select(".legend-svg")
          .selectAll("rect")
          .data(legend_data)
          .update()
          .append("rect")
          .attr("fill",function(d){return ROY_range(d)})
          .attr("fill-opacity",0.8)
          .attr("width", 15)
          .attr("height", 1)
          .attr("x", 50)
          .attr("y", function(d){return d+200;} );

      //ticks of color legend

      yLegendAxis.orient('left')

      d3.select(".legend-svg") // or something else that selects the SVG element in your visualizations
          .append("g") // create a group node
          .attr("transform", "translate(50, 201)")
          .call(yLegendAxis); // call the axis generator

      });
      moveChildren(root);
      update(root);
  }


// Toggle graph svg on packet-rect click

function packet_click(d) {
  // console.log(d);
  if (d.chosen){
    d.chosen = false;
    if (d.details){
      chosen_node_details = chosen_node_details.filter(function(item) { return d.details.indexOf(item) === -1; });
    }
  } else {
    d.chosen = true;
    if (d.details){
      for (each in d.details){
        d.details[each].entireName=d.entireName;
      }
      chosen_node_details = chosen_node_details.concat(d.details);
    }
  }

  // details_svg.selectAll("g.details-node")
  //     .data(chosen_node_details)
  //     .enter()
  //     .append("g");

  d3.selectAll(".graph-link")
    .style("stroke","#ADD8E6");

  d3.selectAll(".packet-node")
    .each( function(d, i) {
      if (d.chosen){
        for (var k in d.links){
          d3.select('#'+k)
            .style("stroke",color1(d.links[k]));
        }
      }
    });

  update(root);
}

function packet_mouseover(d) {
  d3.select(this)
    .text(function(d) {
      return d.entireName+" : "+d.counter;
    });
}

function packet_mouseout(d) {
 d3.select(this)
    .text(function(d) {
      return d.entireName;
    });
}

function name_color(d) {
  return d.expanded ? "#c6dbef" : d._children?  "#3182bd": "#fd8d3c";
}

function packet_rect_color(d) {
  return d.chosen ? "FFFFCC" : "#B0B0B0";
}

function packet_text_color(d) {
  // console.log(d);
  return d.chosen ? "red" : "black";
}

