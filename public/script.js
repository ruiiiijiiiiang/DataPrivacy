var csv;

$.ajaxSetup({ type: 'POST', cache: false });
$(document).ready(function (){
  $.getJSON('dataset.json', function(json) {
    console.log('Read ' + json.length + ' sets of data');
    csv = json;
    init();
  });
});

// Global variables for the histogram
var ageDicts = [{"Age":10,lists:[]},{"Age":20,lists:[]},{"Age":30,lists:[]},{"Age":40,lists:[]},{"Age":50,lists:[]},{"Age":60,lists:[]},{"Age":70,lists:[]},{"Age":80,lists:[]},{"Age":91,lists:[]}];
var GenderDicts = [{Gender:1,lists:[]},{Gender:2,lists:[]}];
var RaceDicts = [{Race:1,lists:[]},{Race:2,lists:[]},{Race:3,lists:[]},{Race:4,lists:[]},{Race:5,lists:[]}];
var currType;

function download() {
  document.getElementById('my_iframe').src = 'dataset.csv';
}

function resetTable(type) {
  if (type === "Age") {
    $("#pqtbl").empty();
  } else {
    var rowCount;
    if (type === "Gender") {
      rowCount = 4;
    } else if (type === "Race") {
      rowCount = 7;
    }
    var tbl = "<table>";
    tbl+= "<tr><th id = 0,0></th><th colspan=2 id = 0,1></th><th id = 0,2></th></tr>";
    var fieldCount = 4;
    for (var ri = 1; ri < rowCount ; ri++) {
      tbl += "<tr>";
      for (var ci = 0; ci < fieldCount; ci++) {
        tbl += "<td id = \'" + ri + "," + ci + "\' style = \"border-top:0px; background:transparent\"></td>";
      }
      tbl += "</tr>";
    }
    tbl += "</table>";
    $("#pqtbl").empty().append(tbl);
  }
}

/** Generates the table */
function init() {

  for (var i = 0,len = csv.length; i < len; i++) {
    ageDicts[Math.floor(csv[i].Age/10 -1)].lists.push(csv[i].Age);
    GenderDicts[csv[i].Gender-1].lists.push(csv[i].Age);
    RaceDicts[csv[i].Race-1].lists.push(csv[i].Age);
  }

  resetTable("Gender");

  var data = [GenderDicts[0].lists.length,GenderDicts[1].lists.length];
  refreshNoiseGender(data,"Gender");
}

function refreshGraph() {
  if (currType === "Age") {
    refreshNoiseAge();
  } else if (currType === "Gender") {
    refreshNoiseGender();
  } else if (currType === "Race") {
    refreshNoiseRace();
  }
  $('#epsVal').html(document.getElementById('epsSlider').value);
}

/** Refreshes the privatized queries, calculates the difference and prints this in the table */
function refreshNoiseGender() {
  resetTable("Gender");
  var test = RaceDicts;
  var eps = document.getElementById("epsSlider").value;
  var sensitivity = 1;
  var GenderOneBefore = test[0].lists.length;
  var GenderOneAfter = Math.max(0,Math.round(GenderOneBefore + laplaceRV(sensitivity,eps/2)));
  var GenderOneNoise = GenderOneAfter - GenderOneBefore;
  var GenderTwoBefore = test[1].lists.length;
  var GenderTwoAfter = Math.max(0,Math.round(GenderTwoBefore + laplaceRV(sensitivity,eps/2)));
  var GenderTwoNoise = GenderTwoAfter - GenderTwoBefore;

  // Populate cells
  document.getElementById("1,1").innerHTML = "<b>Raw</b>";
  document.getElementById("1,2").innerHTML = "<b>Perturbed</b>";
  document.getElementById("1,3").innerHTML = "<b>Noise</b>";
  document.getElementById("2,0").innerHTML = "<b>1</b>";
  document.getElementById("2,1").innerHTML = "0";
  document.getElementById("2,2").innerHTML = "0";
  document.getElementById("2,3").innerHTML = "0";
  document.getElementById("3,0").innerHTML = "<b>2</b>";

  document.getElementById("2,1").innerHTML = GenderOneBefore;
  document.getElementById("2,2").innerHTML = GenderOneAfter;
  document.getElementById("2,3").innerHTML = GenderOneNoise;
  document.getElementById("3,1").innerHTML = GenderTwoBefore;
  document.getElementById("3,2").innerHTML = GenderTwoAfter;
  document.getElementById("3,3").innerHTML = GenderTwoNoise;

  var data = [GenderOneBefore,GenderTwoBefore];
  var noise = [GenderOneNoise,GenderTwoNoise];

  currType = "Gender";
  drawGraph(data,noise,currType);
}

function refreshNoiseRace() {
  resetTable("Race");
  var test = GenderDicts;
  var eps = document.getElementById("epsSlider").value;
  var sensitivity = 1;
  var RaceOneBefore = test[0].lists.length;
  var RaceOneAfter = Math.max(0,Math.round(RaceOneBefore + laplaceRV(sensitivity,eps/2)));
  var RaceOneNoise = RaceOneAfter - RaceOneBefore;
  var RaceTwoBefore = test[1].lists.length;
  var RaceTwoAfter = Math.max(0,Math.round(RaceTwoBefore + laplaceRV(sensitivity,eps/2)));
  var RaceTwoNoise = RaceTwoAfter - RaceTwoBefore;
  var RaceThreeBefore = test[1].lists.length;
  var RaceThreeAfter = Math.max(0,Math.round(RaceThreeBefore + laplaceRV(sensitivity,eps/2)));
  var RaceThreeNoise = RaceThreeAfter - RaceThreeBefore;
  var RaceFourBefore = test[1].lists.length;
  var RaceFourAfter = Math.max(0,Math.round(RaceFourBefore + laplaceRV(sensitivity,eps/2)));
  var RaceFourNoise = RaceFourAfter - RaceFourBefore;
  var RaceFiveBefore = test[1].lists.length;
  var RaceFiveAfter = Math.max(0,Math.round(RaceFiveBefore + laplaceRV(sensitivity,eps/2)));
  var RaceFiveNoise = RaceFiveAfter - RaceFiveBefore;
  // Populate cells
  document.getElementById("1,1").innerHTML = "<b>Raw</b>";
  document.getElementById("1,2").innerHTML = "<b>Perturbed</b>";
  document.getElementById("1,3").innerHTML = "<b>Noise</b>";
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
  document.getElementById("2,3").innerHTML = RaceOneNoise;
  document.getElementById("3,1").innerHTML = RaceTwoBefore;
  document.getElementById("3,2").innerHTML = RaceTwoAfter;
  document.getElementById("3,3").innerHTML = RaceTwoNoise;
  document.getElementById("4,1").innerHTML = RaceThreeBefore;
  document.getElementById("4,2").innerHTML = RaceThreeAfter;
  document.getElementById("4,3").innerHTML = RaceThreeNoise;
  document.getElementById("5,1").innerHTML = RaceFourBefore;
  document.getElementById("5,2").innerHTML = RaceFourAfter;
  document.getElementById("5,3").innerHTML = RaceFourNoise;
  document.getElementById("6,1").innerHTML = RaceFiveBefore;
  document.getElementById("6,2").innerHTML = RaceFiveAfter;
  document.getElementById("6,3").innerHTML = RaceFiveNoise;

  var data = [RaceOneBefore,RaceTwoBefore,RaceThreeBefore,RaceFourBefore,RaceFiveBefore];
  var noise = [RaceOneNoise,RaceTwoNoise,RaceThreeNoise,RaceFourNoise,RaceFiveNoise];
  currType = "Race";
  drawGraph(data,noise,currType);
}

function refreshNoiseAge() {
  resetTable("Age");
  var test = ageDicts;
  var eps = document.getElementById("epsSlider").value;
  var sensitivity = 1;
  var tempData = [];
  var noise = []
  for (var i = 0,len = ageDicts.length; i < len; i++){
    noise.push(Math.max(0,Math.floor(laplaceRV(sensitivity,eps/2))));
    tempData.push(ageDicts[i].lists.length);
  }
  currType = "Age";
  drawGraph(tempData,noise,"Age");
}

var myChart;
function drawGraph(data,noise,type) {
  var label;
  if (type === "Gender"){
    label = ["1", "2"];
  }
  else if (type === "Race"){
    label = ["1","2","3","4","5"];
  }
  else if (type == "Age"){
    label = ["10-20","20-30","30-40","40-50","50-60","60-70","70-80","80-90","90+"];
  }
  if (typeof myChart === 'object') {
    myChart.destroy();
  }
  var model = {
    labels : label,
    datasets: [
        {
          label: type,
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Noise',
          data: noise,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }
    ]
  };
  var ctx = document.getElementById('chart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: model,
    options: {
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
  myChart.options.title.text = "top of chart";   // test, total fail
  myChart.options.legend.display = false;

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
