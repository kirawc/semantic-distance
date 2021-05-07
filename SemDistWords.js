// ---------------------------
//    GET RANDOMIZATION/TRIAL SEQUENCE
// ---------------------------
trials = new Array;
var url = window.location.href
var url_split = url.split("#")
var url_num = url_split[url_split.length - 1]

// Create data structure for save files (cols = vars below; rows = trial)
var data = $.ajax({
  url: 'summaryWORDS.csv',
  dataType: 'text',
}).done(pickRnd);

function pickRnd(data) {

	// converts CSV to array & selects row (randomization)
  var allRows = data.split(/\r?\n|\r/);
  var table = [];
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    var rowCells = allRows[singleRow].split(',');
    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      if (rowCell == 0){
        var table_row = []
      }
      table_row.push(rowCells[rowCell]);
    }
    table.push(table_row);

    var url = window.location.href
    var url_split = url.split("#")
    var url_num = url_split[url_split.length - 1]
    var selected_row = url_num;

  }

 // Row of counterbalancing array to be sampled is stored in the url fragment (part after #)
 var url = window.location.href
 var url_split = url.split("#")
 var url_num = url_split[url_split.length - 1]
 selected_row = url_num;

 //
 seq_filepath = ['randomizWords/' + table[selected_row][0]].toString();

 var seqCSV = $.ajax({
   url: seq_filepath,
   dataType: 'text',
 }).done(loadTrialSeq)};

function loadTrialSeq(seqCSV) {

	var allRows = seqCSV.split(/\r?\n|\r/);
	var table = [];

	for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
		var rowCells = allRows[singleRow].split(',');
		for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
			if (rowCell == 0){
				var table_row = []
			}
			table_row.push(rowCells[rowCell]);
		}
		table.push(table_row);

	trials.push(table);

}}

setTimeout(function(){ totalTrials = trials.length-1; console.log(totalTrials)}, 1000); // subtract one to remove header
//totalTrials = 5; // for testing

// ---------------------------
//    REST OF SET UP
// ---------------------------
// Create data array for save file
var thisData = {
	"subjID":[],
  "seqnum":[],
	"experimentName":[],
	"versionName":[],
	"windowWidth":[],
	"windowHeight":[],
	"screenWidth":[],
	"screenHeight":[],
	"startDate":[],
	"startTime":[],
	"trialNum":[],
  "trialType":[],
	"trialPrompt":[],
  "trialOpt1":[],
  "trialOpt2":[],
	"keyPress":[],
	"RT":[],
};

// Set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();
var seqnum = url_num;

// initialize empty variables
var endExpTime, startExpTime, RT, key, fixTime, stim_seq, trialStim, trialType;

// Load in pretest word options & practice trial stimuli
var pretestStim = ["sunny", "ocean", "hello", "apple"];
var practiceStim = {1:2}

// Initialize time
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// Initialize variables
var pracNum = 0;
var pracTotal = 1;
var trialNum = 0;

// Ready function -- how it loads up at start
$(document).ready(function(){

  $("#landingButton").click(function(){showInstr()})

	document.getElementById("subjID").value = subjID;
	document.getElementById("startDate").value = startDate;
	document.getElementById("startTime").value = startTime;

});

// ---------------------------
//    INSTRUCTIONS
// ---------------------------

// Show start instructions
function showInstr(){

	// Hide previous
  $("#landingPage").hide();
  $("#taskButton").hide();
  $("#preTest").hide();
  $("#famBox").hide()
  $("#famInstr").hide()
  $("#famImg").hide()

	// Show instructions
  $("#taskExpl").show();

	// When button is clicked, start practice trials
	$("#practiceButton").click(function(){

		// Hide everything
		$("#taskExpl").hide();
		$(".instructions").hide();
		$(".exptButtons").hide();
		$("#exptBox").show();
		$("#promptBox").show();
		$("option1Box").show();
		$("option2Box").show();

		// Run practice trials
		runPractice(); })
}

// ---------------------------
//    PRACTICE TRIALS
// ---------------------------
function runPractice(){

	// Assign trial stimuli & type (always same for 1st & 2nd)
	if (pracNum == 0){
		trialType= "w";
		trialStim=["car", "motorcycle", "boat"];
	}

  if (pracNum == 1) {
		trialType = "w"
		trialStim=["daisy","cactus","rose"];
	};

  if (pracNum < pracTotal+1){ // rerun next trial
    showStim(trialStim, trialType, 0);} // 1 indicates it's not a practice trial
  else { // start task
    startTask()
  }
}

// ---------------------------
//    MAIN TRIALS
// ---------------------------

// Hide practice, set up experiment, then run trials
function startTask(){

	// Hide everything
	// (divs)
	$("#exptBox").hide();
	$("#promptBox").hide();
	$("option1Box").hide();
	$("option2Box").hide();

	// Show end of practice message
	$("#endpracticePage").show()

// Waits 1 sec then run real trials
  sleep(1000).then(() => {
		$("#endpracticePage").hide();
		$("#exptBox").show();
		$("#promptBox").show();
		$("#option1Box").show();
		$("#option2Box").show();
    $("#progress").show()

		runTrial(); });
}

// Run through nTrials trials
function runTrial(){

	console.log("trial " + trialNum);

	// hide everything inside divs at the start of each new trial
	$("#opt1Word").hide();
	$("#opt2Word").hide();
	$("#promptWord").hide();

	// select trial type
	currTrial = trials[0][trialNum+1]
	//console.log("trial: " + currTrial)
	trialType = currTrial[4]
	//console.log("type: " + trialType)
	trialStim = [currTrial[5],currTrial[6], currTrial[7]]
	//console.log("stim: " + trialStim)

  $(document).unbind("keydown");

	// actually present the select stimuli
  if (trialNum < totalTrials-1){ // rerun next trial
    showStim(trialStim, trialType, 1);} // 1 indicates it's not a practice trial
  else { // show endPage
      $("#exptBox").hide();
      $(".expt").hide();
      $("#endPage").show();
      $("#revealCodeButton").show();
      endExpTime = new Date;
  }
};

function showStim(trialStim, trialType, practiceOrNot){
  $(document).unbind();

	startTrialTime = new Date; // time at which the scene is presented for a given trial

	$("#promptBox").show();
	$("#option1Box").show();
	$("#option2Box").show();

  $("#opt1Word").show();
  $("#opt2Word").show();
  $("#promptWord").show();

	if (trialType == "w"){ // Run specific for auditory prompt trials

  // Append
	//$("#promptAud").attr("src", "stimuli/" + trialStim[0] + ".mp3")
  $("#promptWord").append(trialStim[0])
  $("#opt1Word").append(trialStim[1])
  $("#opt2Word").append(trialStim[2])

  setTimeout(function(){ detectKeyPress(practiceOrNot)},500);

	}

}

// Collect responses
function detectKeyPress(practiceOrNot){

		$(document).keydown(function(event){
      // if press c
       if (event.keyCode == 37){ //37 is js keycode for left arrow
				key = "left";
				console.log(key);
        if (practiceOrNot == 0) { nextPractice()}
        else if (practiceOrNot == 1) { nextTrial(trialStim, trialType)}
			}

			else if (event.keyCode == 39){ //39 is js keycode for right arrow
				key = "right";
				console.log(key);

        $(document).unbind("keydown");

        if (practiceOrNot == 0) { nextPractice()}
        else if (practiceOrNot == 1) { nextTrial(trialStim, trialType)}

			}
		});
};


function nextPractice(){

  $(document).unbind("keydown");

  // reset image (otherwise the last trial image will flash up while loading)
  resetImgs()

	// Keep running trials until you hit the total trian num
	pracNum++; // increase trial num
  runPractice(); // rerun trial function

}

function nextTrial(){

  $(document).unbind("keydown");
  endTrialTime = new Date;
  RT = endTrialTime - startTrialTime;
  saveTrialData(trialStim, trialType);

  // reset image (otherwise the last trial image will flash up while loading)
  resetImgs()
  updateProgress()

	// Keep running trials until you hit the total trian num
	trialNum++; // increase trial num
  runTrial(); // rerun trial function

}

function resetImgs(){

  $("#promptWord").empty()
  $("#opt1Word").empty()
  $("#opt2Word").empty()

}

function updateProgress() {
  var element = document.getElementById("progressbar");

  if (trialNum == 0){
    width = 1;
    element.style.width = width + '%';}
  else {
    width = width + ((1/totalTrials)*100);
    element.style.width = width + '%';}

}

// ---------------------------
//    FINISH UP + SAVE + SEND TO SERVER
// ---------------------------
// Show end instructions
function endExpt(){

	$("#endPage").append("<br><p style='text-align:left'><strong>Your unique completion code is: </strong>" +subjID+"</p>");
	$("#revealCodeButton").hide();
	saveAllData();

}

// ---------------------
// saving data functions
// ---------------------

function saveTrialData(trialStim, trialType){
	// at the end of each trial, appends values to data dictionary

	// global variables --> will be repetitive, same value for every row (each row will represent one trial)
	thisData["subjID"].push(subjID);
	thisData["experimentName"].push("sem-dist");
	thisData["versionName"].push("v2words");
	thisData["windowWidth"].push($(window).width());
	thisData["windowHeight"].push($(window).height());
	thisData["screenWidth"].push(screen.width);
	thisData["screenHeight"].push(screen.height);
	thisData["startDate"].push(startDate);
	thisData["startTime"].push(startTime);
  thisData["seqnum"].push(seqnum);

	// trial-by-trial variables, changes each time this function is called
	thisData["trialNum"].push(trialNum);
	thisData["trialType"].push(trialType);
	thisData["keyPress"].push(key);
	thisData["RT"].push(RT);
  thisData["trialPrompt"].push(trialStim[0]);
  thisData["trialOpt1"].push(trialStim[1]);
  thisData["trialOpt2"].push(trialStim[2]);

}

function saveAllData() {
	// saves last pieces of data that needed to be collected at the end, and calls sendToServer function
	// add experimentTime and totalTime to data dictionary
	var experimentTime = (endExpTime - startExpTime);
	var totalTime = ((new Date()) - start);
	thisData["experimentTime"]=Array(trialNum).fill(experimentTime);
	thisData["totalTime"]=Array(trialNum).fill(totalTime);

	// change values for input divs to pass to php
	$("#experimentData").val(JSON.stringify(thisData));
	$("#completedTrialsNum").val(trialNum); //how many trials this participant completed

	sendToServer();
}

function sendToServer() {
	// send the data to the server as string (which will be parsed IN php)

	$.ajax({ //same as $.post, but allows for more options to be specified
		headers:{"Access-Control-Allow-Origin": "*", "Content-Type": "text/csv"}, //headers for request that allow for cross-origin resource sharing (CORS)
		type: "POST", //post instead of get because data is being sent to the server
		url: $("#saveData").attr("action"), //url to php
		data: {'data': $("#experimentData").val()}, //not sure why specified here, since we are using the data from the input variable, but oh well

		// if it works OR fails, submit the form
		success: function(){
			document.forms[0].submit();
		},
		error: function(){
			document.forms[0].submit();
		}
	});
}

// ---------------------------
//    USEFUL FUNCTIONS
// ---------------------------

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function uniqueRandoms(qty, min, max){
  var rnd, arr=[];
  do { do { rnd=Math.floor(Math.random()*max)+min }
      while(arr.includes(rnd))
      arr.push(rnd);
  } while(arr.length<qty)
  return arr;
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkArrayValuesInCommon(arr1, arr2){
	for (var i=0; i < arr1.length; i++){
		var overlap = arr2.includes(arr1[i]);
		if (overlap == true){
			break;
		}
	}
	return overlap
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
