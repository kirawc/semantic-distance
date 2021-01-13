// ---------------------------
//    SET UP & INITIALIZATIONS
// ---------------------------

// Create data structure for save files (cols = vars below; rows = trial)
var thisData = {
	"subjID":[],
	"experimentName":[],
	"startDate":[],
	"startTime":[],
	"trialNum":[],
	"cond":[],
	"keyPress":[],
	"accuracy":[],
	"RT":[]
};

// Subject info
var subjID = randomIntFromInterval(100000, 999999);

// Load in task structure (stimuli, condition ns, etc)
var Stim = {"animals":["a1","a2","a3","a4","a5", "a6", "a7", "a8", "a9", "a10"],
 "instruments":["i1","i2","i3","i4","i5", "i6", "i7", "i8", "i9", "i10"],
"tools":["t1","t2","t3","t4","t5", "t6", "t7", "t8", "t9", "t10"]};
var condsOrder = ["a","v","a", "a", "v", "a", "v", "v", "a", "v", "a"];
var totalTrials = condsOrder.length;

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

// Ready function -- how it loads up at start
$(document).ready(function(){

  $("#landingButton").click(function(){runPretest()})

});

// ---------------------------
//    TEST AUDIO
// ---------------------------

// Run audio pretest
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
  sleep(1000).then(() => {
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
	trialType = condsOrder[trialNum];

	// select stimuli for this trial (one from each category)
	var categories = shuffle(Object.keys(Stim));
	c_cat = shuffle(Stim[categories[0]]);
	whichStim = uniqueRandoms(3, 0, 9); // select 3 of 9 in category at random
	trialStim = [c_cat[whichStim[0]], c_cat[whichStim[1]], c_cat[whichStim[2]]];

	// actually present the select stimuli
	showStim(trialStim, trialType, 1); // 1 indicates it's not a practice trial
};


function showStim(trialStim, trialType, practiceOrNot){

	audioFinish = 0; // reset to 0

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
			prompt.onended = function(){console.log("end prompt"); detectKeyPress();(audioFinish += 1); nextPractice()}
		}
		else if (practiceOrNot == 1){
			prompt.onended = function(){console.log("end prompt"); detectKeyPress();(audioFinish += 1); nextTrial()}
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
			opt1.onended = function(){console.log("end opt 1"); detectKeyPress(); nextPractice()}
			opt2.onended = function(){console.log("end opt 2"); detectKeyPress(); nextPractice()}
		}
		else if (practiceOrNot == 1){
			opt1.onended = function(){console.log("end opt 1"); detectKeyPress(); nextTrial()}
			opt2.onended = function(){console.log("end opt 2"); detectKeyPress(); nextTrial()}
		}

	}
}

function nextPractice(){

	// Run through practice trials then start real trials
	if (pracNum < pracTotal+1){

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
			runTrial();
		})
	}

	else {
	 endExpt()
 }
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
// Show end instructions + score
function endExpt(){

  $("#exptBox").hide();
  $(".expt").hide();
  $("#endPage").show();
	//saveAllData();

}

// Save data


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
