import { Injectable } from '@angular/core';

@Injectable()
export class GraphCreatorService {

  idct = 0;
  nodes = [];
  edges = [];
  state = {
    selectedNode: null,
    selectedEdge: null,
    mouseDownNode: null,
    mouseDownLink: null,
    justDragged: false,
    justScaleTransGraph: false,
    lastKeyDown: -1,
    shiftNodeDrag: false,
    selectedText: null
  };

  constructor() { }

  init(svg, nodes, edges) {
    console.log('thisGraph:');

    this.nodes = nodes;
    this.edges = edges;
    // define arrow markers for graph links
    const defs = svg.append('defs');
    defs.append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', "32")
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // define arrow markers for leading arrow

    defs.append('marker')
      .attr('id', 'mark-end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 7)
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    thisGraph.svg = svg;
    thisGraph.svgG = svg.append("g")
      .classed(thisGraph.consts.graphClass, true);
    var svgG = thisGraph.svgG;

    // displayed when dragging between nodes
    thisGraph.dragLine = svgG.append('path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0')
      .style('marker-end', 'url(#mark-end-arrow)');

    // svg nodes and edges
    thisGraph.paths = svgG.append("g").selectAll("g");
    thisGraph.circles = svgG.append("g").selectAll("g");

    thisGraph.drag = d3.behavior.drag()
      .origin(function (d) {
        // d = selected circle. The drag origin is the origin of the circle
        return {
          x: d.x,
          y: d.y
        };
      })
      .on("drag", function (args) {
        thisGraph.state.justDragged = true;
        thisGraph.dragmove.call(thisGraph, args);
      })
      .on("dragend", function (args) {
        // args = circle that was dragged
      });

    // listen for key events
    d3.select(window).on("keydown", function () {
      thisGraph.svgKeyDown.call(thisGraph);
    })
      .on("keyup", function () {
        thisGraph.svgKeyUp.call(thisGraph);
      });
    svg.on("mousedown", function (d) {
      thisGraph.svgMouseDown.call(thisGraph, d);
    });
    svg.on("mouseup", function (d) {
      thisGraph.svgMouseUp.call(thisGraph, d);
    });

    // listen for dragging
    var dragSvg = d3.behavior.zoom()
      .on("zoom", function () {
        console.log('zoom triggered');
        if (d3.event.sourceEvent.shiftKey) {
          // TODO  the internal d3 state is still changing
          return false;
        } else {
          thisGraph.zoomed.call(thisGraph);
        }
        return true;
      })
      .on("zoomstart", function () {
        var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
        if (ael) {
          ael.blur();
        }
        if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
      })
      .on("zoomend", function () {
        d3.select('body').style("cursor", "auto");
      });

    svg.call(dragSvg).on("dblclick.zoom", null);

    // listen for resize
    window.onresize = function () {
      thisGraph.updateWindow(svg);
    };

    // help icon click
    d3.select("#help").on("click", function () {
      $('#helpbox').removeClass('hidden');
    });

    // reset zoom
    d3.select("#reset-zoom").on("click", function () {
      d3.select(".graph")
        .transition() // start a transition
        .duration(1000) // make it last 1 second
        .attr('transform', "translate(1,0)");

      dragSvg.scale(1);
      dragSvg.translate([1, 0]);
    });

    // handle download data
    d3.select("#download-input").on("click", function () {
      var saveEdges = [];
      thisGraph.edges.forEach(function (val, i) {
        saveEdges.push({
          source: val.source.id,
          target: val.target.id
        });
      });
      var blob = new Blob([window.JSON.stringify({
        "nodes": thisGraph.nodes,
        "edges": saveEdges
      })], {
          type: "text/plain;charset=utf-8"
        });
      saveAs(blob, "mydag.json");
    });


    // handle uploaded data

    d3.select("#upload-input").on("click", function () {
      document.getElementById("hidden-file-upload").click();
    });
    d3.select("#hidden-file-upload").on("change", function () {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var uploadFile = this.files[0];
        var filereader = new window.FileReader();

        filereader.onload = function () {
          var txtRes = filereader.result;
          // TODO better error handling
          try {
            var jsonObj = JSON.parse(txtRes);
            thisGraph.deleteGraph(true);
            thisGraph.nodes = jsonObj.nodes;
            thisGraph.setIdCt(jsonObj.nodes.length + 1);
            var newEdges = jsonObj.edges;
            newEdges.forEach(function (e, i) {
              newEdges[i] = {
                source: thisGraph.nodes.filter(function (n) {
                  return n.id == e.source;
                })[0],
                target: thisGraph.nodes.filter(function (n) {
                  return n.id == e.target;
                })[0]
              };
            });
            thisGraph.edges = newEdges;
            thisGraph.updateGraph();
          } catch (err) {
            window.alert("Error parsing uploaded file\nerror message: " + err.message);
            return;
          }
        };
        filereader.readAsText(uploadFile);

      } else {
        alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
      }

    });

    // handle delete graph
    d3.select("#delete-graph").on("click", function () {
      thisGraph.deleteGraph(false);
    });
  }

}
