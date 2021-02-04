// ---------------------------
//    GET RANDOMIZATION/TRIAL SEQUENCE
// ---------------------------
trials = new Array;

// Create data structure for save files (cols = vars below; rows = trial)
var data = $.ajax({
  url: 'randomizations/summary.csv',
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
  }

  // selects a row
	var found = false;
		for (var row = 1; row < table.length; row++){
				var sampled = table[row][1];
				if (found == false){
					if (sampled == "0"){
						//var seq_filepath = table[row][0]; // selects sequence filepath that has not been sampled --> 0
						var selected_row = row;
						var found = true;
					 }
				 }
			 }

 print(selected_row)
 //
 seq_filepath = ['randomizations/' + table[selected_row][0]].toString();
 print(seq_filepath)

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

//setTimeout(function(){ totalTrials = trials.length; }, 1000);

totalTrials = 5;

// ---------------------------
//    REST OF SET UP
// ---------------------------
// Create data array for save file
var thisData = {
	"subjID":[],
	"experimentName":[],
	"versionName":[],
	"windowWidth":[],
	"windowHeight":[],
	"screenWidth":[],
	"screenHeight":[],
	"startDate":[],
	"startTime":[],
	"trialNum":[],
	"cond":[],
	"keyPress":[],
	"RT":[],
};

// Set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var endExpTime, startExpTime, RT, key, fixTime, cond, stim_seq;

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
var currTrial = 0;
var audioFinish = 0;
var endExpTime, startExpTime, cond;

// Get totalTrials -- it's delayed because otherwise it will evaluate before

// Ready function -- how it loads up at start
$(document).ready(function(){

  $("#landingButton").click(function(){runPretest()})

});

// ---------------------------
//    TEST AUDIO
// ---------------------------

// Run audio pretest -- currently skipped because I put it in the mturk instead but leaving func in
function runPretest(){

	$("#landingPage").hide();

	// Select word & change pretest audio to that recording
	curr_word = pretestStim[getRandomInt(3)];
	$("#testsound").attr("src", "stimuli/" + curr_word + ".mp3")

	// For the selected word, change associated button to "correct"
	$("#" + curr_word).addClass("corr").removeClass("wrong")

	// Show pretest div (audio + sounds)
  $("#preTest").show();

	// If button labeled correct is click, show task button
	$(".corr").click(function(){
		$("#taskButton").show()
		$(".corr").hide()
		$(".wrong").hide()
	});

  // If any button labeled wrong correct, show "not eligible" message
	$(".wrong").click(function(){
		$("#failedpretask").show()
		$(".corr").hide()
		$(".wrong").hide()
	});

	// When the task button is clicked, show instr
  $("#taskButton").click(function(){showInstr()})

}

// ---------------------------
//    INSTRUCTIONS
// ---------------------------

// Show start instructions
function showInstr(){

	// Hide previous
	$("#landingPage").hide();
	$("#preTest").hide();
	$(".instructions").hide();
  $("#exptBox").hide();

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

	// Hide everything
	// (images)
	$("#promptImg").hide();
	$("#opt1Img").hide();
	$("#opt2Img").hide();
	// (buttons)
	$("#playPrompt").hide();
	$("#playOpt1").hide();
	$("#playOpt2").hide();

	// Assign trial stimuli & type (always same for 1st & 2nd)
	if (pracNum == 0){
		trialType= "a";
		trialStim=["typing", "printer_02s", "pen_11s"];
	}
	else {
		trialType = "v"
		trialStim=["bike_10s","car","train"];
	};

	// Actually show stimuli/practice tria
	showStim(trialStim, trialType, 0); // 0 indicates it is a practice trial
	console.log("practice " + pracNum)

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
	// (images)
	$("#promptImg").hide();
	$("#opt1Img").hide();
	$("#opt2Img").hide();
	// (buttons)
	$("#playPrompt").hide();
	$("#playOpt1").hide();
	$("#playOpt2").hide();

	// Show end of practice message
	$("#endpracticePage").show()

// Waits 1 sec then run real trials
  sleep(3000).then(() => {
		$("#endpracticePage").hide();
		$("#exptBox").show();
		$("#promptBox").show();
		$("#option1Box").show();
		$("#option2Box").show();

		runTrial(); });
}

// Run through nTrials trials
function runTrial(){

	console.log("trial " + trialNum);

	// hide everything inside divs at the start of each new trial
	$("#opt1Img").hide();
	$("#opt2Img").hide();
	$("#promptImg").hide();
	$("#playPrompt").hide();
	$("#playOpt1").hide();
	$("#playOpt2").hide();

	// select trial type
	currTrial = trials[0][trialNum+1]
	console.log("trial: " + currTrial)
	trialType = currTrial[4]
	console.log("type: " + trialType)
	trialStim = [currTrial[5],currTrial[6], currTrial[7]]
	console.log("stim: " + trialStim)

	// actually present the select stimuli
	showStim(trialStim, trialType, 1); // 1 indicates it's not a practice trial
};


function showStim(trialStim, trialType, practiceOrNot){

	startTrialTime = new Date; // time at which the scene is presented for a given trial

	$("#promptBox").show();
	$("#option1Box").show();
	$("#option2Box").show();

	if (trialType == "a"){ // Run specific for auditory prompt trials

  // Change image file sources
	//$("#promptAud").attr("src", "stimuli/" + trialStim[0] + ".mp3")
	prompt = new Audio("stimuli/" + trialStim[0] + ".mp3")
	$("#opt1Img").attr("src","stimuli/" + trialStim[1] + ".jpg");
  $("#opt2Img").attr("src","stimuli/" + trialStim[2] + ".jpg");

		// Change audio file sources + set up on click
		$("#playPrompt").click(function(){
			prompt.play();
		});

  // Show button & images
		$("#playPrompt").show()
		$("#opt1Img").show();
  	$("#opt2Img").show();

		// Collect if audio has played or not
		if (practiceOrNot == 0){
			prompt.onended = function(){console.log("(P) end prompt"); nextPractice()}
		}
		else if (practiceOrNot == 1){
			prompt.onended = function(){console.log("end prompt"); nextTrial()}
		}
	}

	else if (trialType = "v"){ // Run specifics for auditory prompt trials
		// Change file sources
		$("#promptImg").attr("src","stimuli/" + trialStim[0] + ".jpg");
		opt1 = new Audio("stimuli/" + trialStim[1] + ".mp3")
		opt2 = new Audio("stimuli/" + trialStim[2] + ".mp3")

		// Set up audio buttons
		$("#playOpt1").click(function(){
			opt1.play();
		});

		$("#playOpt2").click(function(){
			opt2.play();
		});

		// Show button & images
		$("#promptImg").show()
		$("#playOpt1").show();
  	$("#playOpt2").show();

		if (practiceOrNot == 0){
			opt1.onended = function(){console.log("(P) end opt 1");}
			opt2.onended = function(){console.log("(P) end opt 2"); nextPractice()}
		}
		else if (practiceOrNot == 1){
			opt1.onended = function(){console.log("end opt 1");}
			opt2.onended = function(){console.log("end opt 2"); nextTrial()}
		}

	}
}

function nextPractice(){

	// Run through practice trials then start real trials
	if (pracNum < pracTotal){

		$(document).keypress(function(){
			pracNum++;
			$(document).unbind("keypress");
			runPractice();
		})
	}

	else {
	 startTask()
	}
}

function nextTrial(){

	// Keep running trials until you hit the total trian num
	if (trialNum < totalTrials){

		$(document).keypress(function(){
			trialNum++;
			$(document).unbind("keypress");

			// Save dataType
			endTrialTime = new Date;
			RT = endTrialTime - startTrialTime;
			saveTrialData();

			// reset image (otherwise the last trial image will flash up while loading)
			resetImgs()

			// let everything
			setTimeout(runTrial(), 1);
		})

	}

	else {
	 endExpt()
 }
}

function resetImgs(){

	$("#promptImg").attr("src","");
	$("#opt1Img").attr("src","");
	$("#opt2Img").attr("src","");

}

// Collect response
function detectKeyPress(){

	// add event listener for keypress
		$(document).bind("keypress", function(event){
			if (event.which == 99){ //99 is js keycode for c
				key = "c";
				console.log(key);
			}
			else if (event.which == 109){ //109 is js keycode for m
				key = "m";
				console.log(key);
			}
		});
};

// ---------------------------
//    FINISH UP + SAVE + SEND TO SERVER
// ---------------------------
// Show end instructions
function endExpt(){

  $("#exptBox").hide();
  $(".expt").hide();
  $("#endPage").show();
	$("#endPage").append("<br><p style='text-align:center'><strong>Your unique completion code is: </strong>" +subjID+"</p>");
	$("#revealCodeButton").hide();
	saveAllData();

}


// ---------------------
// saving data functions
// ---------------------

function saveTrialData(){
	// at the end of each trial, appends values to data dictionary

	// global variables --> will be repetitive, same value for every row (each row will represent one trial)
	thisData["subjID"].push(subjID);
	thisData["experimentName"].push("sem-dist");
	thisData["versionName"].push("v1");
	thisData["windowWidth"].push($(window).width());
	thisData["windowHeight"].push($(window).height());
	thisData["screenWidth"].push(screen.width);
	thisData["screenHeight"].push(screen.height);
	thisData["startDate"].push(startDate);
	thisData["startTime"].push(startTime);

	// trial-by-trial variables, changes each time this function is called
	thisData["trialNum"].push(trialNum);
	thisData["cond"].push(cond);
	thisData["keyPress"].push(key);
	thisData["RT"].push(RT);
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
		data: $("#experimentData").val(), //not sure why specified here, since we are using the data from the input variable, but oh well

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
