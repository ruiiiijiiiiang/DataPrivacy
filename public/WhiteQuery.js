
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
var ageDicts = [{"Age":10,lists:[]},{"Age":20,lists:[]},{"Age":30,lists:[]},{"Age":40,lists:[]},{"Age":50,lists:[]},{"Age":60,lists:[]},{"Age":70,lists:[]},{"Age":80,lists:[]},{"Age":91,lists:[]}];
var GenderDicts = [{Gender:1,lists:[]},{Gender:2,lists:[]}];
var RaceDicts = [{Race:1,lists:[]},{Race:2,lists:[]},{Race:3,lists:[]},{Race:4,lists:[]},{Race:5,lists:[]}];
var currType;

function resetTable() {
  var tbl = "<table>";
  tbl+= "<tr><th id = 0,0></th><th colspan=2 id = 0,1></th><th id = 0,2></th></tr>";

  var rowCount = 7  ,
      fieldCount = 4;
  for (var ri = 1; ri < rowCount ; ri++) {
    tbl += "<tr>";
    for (var ci = 0; ci < fieldCount; ci++) {
      tbl += "<td id = " + ri + "," + ci + " style = \"border-top:0px; background:transparent\"></td>";
    }
    tbl += "</tr>";
  }
  tbl += "</table>";
  return tbl;
}

/** Generates the table */
function init() {

  for (var i = 0,len = csv.length; i < len; i++) {
    ageDicts[Math.floor(csv[i].Age/10 -1)].lists.push(csv[i].Age);
    GenderDicts[csv[i].Gender-1].lists.push(csv[i].Age);
    RaceDicts[csv[i].Race-1].lists.push(csv[i].Age);
  }

  $("#pqtbl").html(resetTable());

  var data = [GenderDicts[0].lists.length,GenderDicts[1].lists.length];
  refreshNoiseGender(data,"Gender");
  //refreshNoise();
}
/** Creates a new histogram as the distribution has changed */
function refreshHistogram() {
  if (currType === "Age") {
    refreshNoiseAge();
  } else if (currType === "Gender") {
    refreshNoiseGender();
  } else if (currType === "Race") {
    refreshNoiseRace();
  }
}

/** Refreshes the privatized queries, calculates the difference and prints this in the table */
function refreshNoiseGender() {
  //printBudget();
  var test = RaceDicts;
  var eps = document.getElementById("budgetSlider").value;
  var  sensitivity = 1;
  var GenderOneBefore = test[0].lists.length;
  var GenderOneAfter = Math.max(0,Math.round(GenderOneBefore + laplaceRV(sensitivity,eps/2)));
  var GenderTwoBefore = test[1].lists.length;
  var GenderTwoAfter = Math.max(0,Math.round(GenderTwoBefore + laplaceRV(sensitivity,eps/2)));


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

  document.getElementById("2,1").innerHTML = GenderOneBefore;
  document.getElementById("2,2").innerHTML = GenderOneAfter;
  document.getElementById("2,3").innerHTML = Math.max(0,GenderOneBefore-GenderOneAfter);
  document.getElementById("3,1").innerHTML = GenderTwoBefore;
  document.getElementById("3,2").innerHTML = GenderTwoAfter;
  document.getElementById("3,3").innerHTML = Math.max(0,GenderTwoBefore-GenderTwoAfter );

  var data = [GenderOneBefore,GenderTwoBefore];
  var noise = [GenderOneAfter-GenderOneBefore,GenderTwoAfter-GenderTwoBefore];

  //console.log(data);
  currType = "Gender";
  drawHistogram(data,noise,currType);

}
 function refreshNoiseRace() {
   //printBudget();
   var test = GenderDicts;
   var eps = document.getElementById("budgetSlider").value;
   var  sensitivity = 1;
   var RaceOneBefore = test[0].lists.length;
   var RaceOneAfter = Math.max(0,Math.round(RaceOneBefore+ laplaceRV(sensitivity,eps/2)));
   var RaceTwoBefore = test[1].lists.length;
   var RaceTwoAfter = Math.max(0,Math.round(RaceTwoBefore + laplaceRV(sensitivity,eps/2)));
   var RaceThreeBefore = test[1].lists.length;
   var RaceThreeAfter = Math.max(0,Math.round(RaceThreeBefore + laplaceRV(sensitivity,eps/2)));
   var RaceFourBefore = test[1].lists.length;
   var RaceFourAfter = Math.max(0,Math.round(RaceFourBefore + laplaceRV(sensitivity,eps/2)));
   var RaceFiveBefore = test[1].lists.length;
   var RaceFiveAfter = Math.max(0,Math.round(RaceFiveBefore + laplaceRV(sensitivity,eps/2)));
   // Populate cells
   document.getElementById("0,1").innerHTML = "<font color=\"#5e7185\">Race</font>";
   document.getElementById("0,2").innerHTML = "<font color=\"#5e7185\">Noise</font>";
   document.getElementById("1,1").innerHTML = "<b>Before the Move</b>";
   document.getElementById("1,2").innerHTML = "<b>After the Move</b>";
   document.getElementById("2,0").innerHTML = "<b>1</b>";
   document.getElementById("2,1").innerHTML = "0";
   document.getElementById("2,2").innerHTML = "0";
   document.getElementById("2,3").innerHTML = "0";
   document.getElementById("3,0").innerHTML = "<b>2</b>";
   document.getElementById("3,1").innerHTML = "0";
   document.getElementById("3,2").innerHTML = "0";
   document.getElementById("3,3").innerHTML = "0";
   document.getElementById("4,0").innerHTML = "<b>3</b>";
   document.getElementById("4,1").innerHTML = "0";
   document.getElementById("4,2").innerHTML = "0";
   document.getElementById("4,3").innerHTML = "0";
   document.getElementById("5,0").innerHTML = "<b>4</b>";
   document.getElementById("5,1").innerHTML = "0";
   document.getElementById("5,2").innerHTML = "0";
   document.getElementById("5,3").innerHTML = "0";
   document.getElementById("6,0").innerHTML = "<b>5</b>";
   document.getElementById("6,1").innerHTML = "0";
   document.getElementById("6,2").innerHTML = "0";
   document.getElementById("6,3").innerHTML = "0";

   document.getElementById("2,1").innerHTML = RaceOneBefore;
   document.getElementById("2,2").innerHTML = RaceOneAfter;
   document.getElementById("2,3").innerHTML = Math.max(0,RaceOneBefore-RaceOneAfter);
   document.getElementById("3,1").innerHTML = RaceTwoBefore;
   document.getElementById("3,2").innerHTML = RaceTwoAfter;
   document.getElementById("3,3").innerHTML = Math.max(0,RaceTwoBefore-RaceTwoAfter );
   document.getElementById("4,1").innerHTML = RaceThreeBefore;
   document.getElementById("4,2").innerHTML = RaceThreeAfter;
   document.getElementById("4,3").innerHTML = Math.max(0,RaceThreeBefore-RaceThreeAfter);
   document.getElementById("5,1").innerHTML = RaceFourBefore;
   document.getElementById("5,2").innerHTML = RaceFourAfter;
   document.getElementById("5,3").innerHTML = Math.max(0,RaceFourBefore-RaceFourAfter );
   document.getElementById("6,1").innerHTML = RaceFiveBefore;
   document.getElementById("6,2").innerHTML = RaceFiveAfter;
   document.getElementById("6,3").innerHTML = Math.max(0,RaceFiveBefore-RaceFiveAfter );


   var data = [RaceOneBefore,RaceTwoBefore,RaceThreeBefore,RaceFourBefore,RaceFiveBefore];
   var noise = [RaceOneAfter-RaceOneBefore,RaceTwoAfter-RaceTwoBefore,RaceThreeAfter-RaceThreeBefore,RaceFourAfter-RaceFourBefore,RaceFiveAfter-RaceFiveBefore];
   //console.log(arrays);
   currType = "Race";
   drawHistogram(data,noise,currType);

 }
 function refreshNoiseAge() {
   //printBudget();
   var test = ageDicts;
   var eps = document.getElementById("budgetSlider").value;
   var  sensitivity = 1;
   var tempData = [];
   var noise = []
   for (var i = 0,len = ageDicts.length; i < len; i++){
     noise.push(Math.max(0,Math.floor(laplaceRV(sensitivity,eps/2))));
     tempData.push(ageDicts[i].lists.length + noise[i]);
   }
   //console.log(tempData);
   currType = "Age";
   drawHistogram(tempData,noise,"Age");

 }

 var myChart;
/** Initializes the histogram (draws axes) */
function drawHistogram(data,noise,type) {
  $("#pqtbl").html(resetTable());
  console.log('type:', type);
  console.log(data);
  var label;
  if (type === "Gender"){
    label = ["Male", "Female"];
  }
  else if (type === "Race"){
    label = ["1","2","3","4","5"];
  }
  else if (type == "Age"){
    label = ["10-20","20-30","30-40","40-50","50-60","60-70","70-80","80-91"];
  }
  if (typeof myChart === 'object') {
    myChart.destroy();
  }
  //console.log(data);
  var model = {
    labels : label,
    datasets: [
        {
            data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        }
    ]
  };
  var ctx = document.getElementById('chart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: model
  });
  myChart.options.title.text = "top of chart";   // test, total fail
  myChart.options.legend.display = false;

}
/**
 * Updates the histogram on refresh (i.e. adds an extra bar)
 * @param {float} value - the value of the bar to add
 */

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
  if(u<0) {return Math.abs(b * Math.log(1+2*u));}
  else {return Math.abs(-b * Math.log(1-2*u));}
}
