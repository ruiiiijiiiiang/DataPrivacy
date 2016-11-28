/*
 - Copyright 2014 Neustar, Inc.
 -
 - Licensed under the Apache License, Version 2.0 (the "License");
 - you may not use this file except in compliance with the License.
 - You may obtain a copy of the License at
 -
 -     http://www.apache.org/licenses/LICENSE-2.0
 -
 - Unless required by applicable law or agreed to in writing, software
 - distributed under the License is distributed on an "AS IS" BASIS,
 - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 - See the License for the specific language governing permissions and
 - limitations under the License.
 */

 var csv;

 jQuery.ajaxSetup({ type: 'POST', cache: false });
 jQuery(document).ready(function (){
   jQuery.getJSON('dataset.json', function(json) {
     console.log('Read ' + json.length + ' sets of data');
     csv = json;
     init();
   });
 });



// Global variables for the histogram
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 595 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;
var svg, data = [],
    TRANSTIME = 25, // Time taken to transition
    stop = false;   // Allow simulator to run
// Formats
var comma0dp = d3.format(",.0f"),
    comma1dp = d3.format(",.1f"),
    comma2dp = d3.format(",.2f");
var ageDicts = [];
var GenderDicts = [{Gender:1,lists:[]},{Gender:2,lists:[]}];
var RaceDicts = [{Race:1,lists:[]},{Race:2,lists:[]},{Race:3,lists:[]},{Race:4,lists:[]},{Race:5,lists:[]}];

/** Generates the table */
function init() {

  for (var i = 0,len = csv.length; i < len; i++) {
    ageDicts.push(csv[i].Age);
    GenderDicts[csv[i].Gender-1].lists.push(csv[i].Age);
    RaceDicts[csv[i].Race-1].lists.push(csv[i].Age);
  }

  //window.onload = function() {printBudget();}

  var tbl = "<table>";
  tbl+= "<tr><th id = 0,0></th><th colspan=2 id = 0,1></th><th id = 0,2></th></tr>";

  var rowCount = 4,
      fieldCount = 4;
  for (var ri = 1; ri < rowCount ; ri++) {
      tbl += "<tr>";
      for (var ci = 0; ci < fieldCount; ci++) {
          tbl += "<td id = " + ri + "," + ci + " style = \"border-top:0px; background:transparent\"></td>";
      }
      tbl += "</tr>";
  }
  tbl += "</table>";
  document.getElementById("pqtbl").innerHTML = tbl;


  // Populate cells
  document.getElementById("0,1").innerHTML = "<font color=\"#5e7185\">Gender</font>";
  document.getElementById("0,2").innerHTML = "<font color=\"#5e7185\">Noise</font>";
  document.getElementById("1,1").innerHTML = "<b>Before the Move</b>";
  document.getElementById("1,2").innerHTML = "<b>After the Move</b>";
  document.getElementById("2,0").innerHTML = "<b>Male</b>";
  document.getElementById("2,1").innerHTML = "0";
  document.getElementById("2,2").innerHTML = "0";
  document.getElementById("2,3").innerHTML = "0";
  document.getElementById("3,0").innerHTML = "<b>Female</b>";


  var data = [GenderDicts[0].lists.length,GenderDicts[1].lists.length];
  drawHistogram(data);
  refreshNoise();
}
/** Creates a new histogram as the distribution has changed */
function refreshHistogram() {
  d3.select("#SVGhisto")
    .remove();

  drawHistogram();
  refreshNoise();
}

/** Refreshes the privatized queries, calculates the difference and prints this in the table */
function refreshNoise() {
  //printBudget();
  var test = GenderDicts;
  var eps = document.getElementById("budgetSlider").value;
  var  sensitivity = 1;
  var GenderOneBefore = test[0].lists.length;
  var GenderOneAfter = Math.max(0,Math.round(GenderOneBefore + laplaceRV(sensitivity,eps/2)));
  var GenderTwoBefore = test[1].lists.length;
  var GenderTwoAfter = Math.max(0,Math.round(GenderTwoBefore + laplaceRV(sensitivity,eps/2)));
  document.getElementById("2,1").innerHTML = GenderOneBefore;
  document.getElementById("2,2").innerHTML = GenderOneAfter;
  document.getElementById("2,3").innerHTML = Math.max(0,GenderOneBefore-GenderOneAfter);
  document.getElementById("3,1").innerHTML = GenderTwoBefore;
  document.getElementById("3,2").innerHTML = GenderTwoAfter;
  document.getElementById("3,3").innerHTML = Math.max(0,GenderTwoBefore-GenderTwoAfter );
  var difference1 = Math.max(0,GenderOneBefore-GenderOneAfter );
  var differnce2 = Math.max(0,GenderTwoBefore-GenderTwoAfter )
  var arrays = [GenderOneBefore,GenderTwoBefore];
  console.log(arrays);
  updateHistogram(arrays);

}
/** Initializes the histogram (draws axes) */
function drawHistogram(data) {
  console.log(data);
  var model = {
    labels: ["Male", "Female"],
    datasets: [
        {
            data: data
        }
    ]
  };
  var ctx = document.getElementById('chart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: model
  });
/*
  var x = d3.scale.linear()
      .domain(['Male', 'Female']);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var y = d3.scale.ordinal()
      .range([d3.max(array)]);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  svg = d3.select("#histogram").append("svg")
      .attr("id", "SVGhisto")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)" );

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Value ($)");

  svg.selectAll("bar")
    .data(data)
  .enter().append("rect")
    .style("fill", "steelblue")
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return height - y(d.value); });
*/
}
/**
 * Updates the histogram on refresh (i.e. adds an extra bar)
 * @param {float} value - the value of the bar to add
 */
function updateHistogram(data) {

  // Exclude outlying points
  //var eps = document.getElementById("budgetSlider").value,
  //    lap99 = -(1000000/(eps/2))*Math.log(0.02), // 99th percentile of Laplace
  //    minLap = 1000000-lap99,
  //    maxLap = 1000000+lap99;

  //if(val > minLap && val < maxLap)
  //  data.push(val); // append income value to list
  //else {
  //  if(data.length == 0)  // to avoid null histogram being printed
  //    refreshNoise();
  //  return;
  //}
  //console.log(data);
  /*
  var x = d3.scale.linear()
      .domain([d3.min(data), d3.max(data)])
      .range([0, width]);

  // Update scale domains
  x = d3.scale.linear()
      .domain([d3.min(data), d3.max(data)])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

  // Update x axis
  svg.select("#xaxis")
    .transition()
      .duration(TRANSTIME)
      .call(xAxis);

  // Draw histogram
  svg.selectAll("rect").remove();

  var bar = svg.selectAll("rect")
      .data(data)
      .enter()
    .append("g")
      .attr("class", "bar");

  // Draw bars
  bar.append("rect")
      .attr("x", -width/2)
      .attr("y", y)
      .attr("width", width/2)
      .attr("height", height)
    .transition()
      .duration(TRANSTIME)
      .attr("y", height)
      .attr("height", height);


  // Draw text
  d3.selectAll("#barText").remove();

  bar.append("text")
      .attr("id", "barText")
      .attr("dy", ".75em")
      .attr("y", y)
      .attr("x", -width/2)
      .attr("fill", function(d) {
        if(y(d.y)<(height-20)) return "white";
        else return "none";
      })
      .text(function(d) { return comma0dp(d.y); })
    .transition()
      .duration(TRANSTIME)
      .attr("y", y);
    */
}
/** Executes the correct function and changes button text when play/stop button is pressed */
function change() {
  var button = document.getElementById("sim");
  if (button.innerHTML=="Play Simulation") {
    button.innerHTML = "Stop Simulation";
    simulate(TRANSTIME*2);
  }
  else {
    button.innerHTML = "Play Simulation";
    stopSim();
  }
}
/**
 * Executes the refreshNoise function in an infinite loop with a delay between iterations, essentially to build a large histogram
 * @param {int} milliseconds - the delay in milliseconds
 */
function simulate(milliseconds) {
  stop = false;
  setTimeout(function () {
      refreshNoise();
      if(stop == false)
        simulate(milliseconds);
  }, milliseconds);
}
/** Stops the simulation */
function stopSim() {
  stop = true;
}
/**
 * Generates Laplace random variables
 * @param {float} sensitivity - the sensitivity of the variable used in the query
 * @param {float} eps - the privacy parameter
 * @returns {float} a Laplace random variable
 */
function laplaceRV(sensitivity, eps) {
  var u = 0.5 - Math.random(),
  b = sensitivity / eps;
  if(u<0) {return b * Math.log(1+2*u);}
  else {return -b * Math.log(1-2*u);}
}
