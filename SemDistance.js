// ---------------------------
//    SETTING UP
// ---------------------------

// Data structure (how the data will be saved)
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

// Task structure (stimuli, condition ns, etc)
var Stim = {"animals":["a1","a2","a3","a4","a5", "a6", "a7", "a8", "a9", "a10"],
 "instruments":["i1","i2","i3","i4","i5", "i6", "i7", "i8", "i9", "i10"],
"tools":["t1","t2","t3","t4","t5", "t6", "t7", "t8", "t9", "t10"]};

var condsOrder = ["a","v","a", "a", "v", "a", "v", "v", "a", "v", "a"];
var totalTrials = condsOrder.length;
var stimTime = 5000;

// Initialize time
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// Initialize variables
var trialNum = 0;
var currTrial = 0;
var endExpTime, startExpTime, cond;

// Ready function -- how it loads up at start
$(document).ready(function(){

  $("#landingButton").click(function(){runPretest()})

});

// Preload stimuli into a hidden div
function preloadImgs(){

   // append every img in visStim to preload div
  for (var n_visStim=0; n_visStim<visStim.length; n_visStim++){

    var img = document.createElement("IMG");
    img.src = "stimuli/" + visStim[n_visStim];
    $("#preload").append(img);

  }
}

// ---------------------------
//    SHOW INSTRUCTIONS + TEST AUDIO
// ---------------------------

// Run audio pretest
function runPretest(){

	$("#landingPage").hide();

	// select

	// show
  $("#preTest").show();
	$("#corrButton").show();
	$("#wrongButton").show();

	//
	$("#corrButton").click(function(){
		$("#taskButton").show()
		$("#corrButton").hide()
		$(".wrong").hide()

})

	$(".wrong").click(function(){
		$("#failedpretask").show()
		$("#corrButton").hide()
		$(".wrong").hide()})

	//
  $("#taskButton").click(function(){showInstr()})

}

// Show start instructions
function showInstr(){

	$("#preTest").hide();
	$(".instructions").hide();
  $("#exptBox").hide();
  $("#taskExpl").show();
  $("#practiceButton").click(function(){startTask()})

}

// Run example trials
function practiceTrials(){

	trialStim = ["a1", "a2", "a3"]
	showStim(trialStim, "v")

	}

// ---------------------------
//    TASK ITSELF
// ---------------------------

// Hide instructions, set up experiment, then run trials
function startTask(){

	// indicate this is the start of the real trial
	$("#startPage").show()

  // set up to start expt
	$("#taskExpl").hide();
  $(".instructions").hide();
  $(".exptButtons").hide();
  $("#exptBox").show();

  runTrial() // Runs a trial until
}

// Run through nTrials trials
function runTrial(){

	console.log(trialNum);

	// hide everything at the start of each trial
	$("#playPrompt").hide();
	$("#opt1Img").hide();
	$("#opt2Img").hide();
	$("#promptImg").hide();
	$("#playOpt1").hide();
	$("#playOpt2").hide();
	$("#pausePrompt").hide();
	$("#pauseOpt1").hide();
	$("#pauseOpt2").hide();

	// select trial type
	trialType = condsOrder[trialNum];

	// select stimuli for this trial (one from each category)
	var categories = shuffle(Object.keys(Stim));
	c_cat = shuffle(Stim[categories[0]]);
	whichStim = uniqueRandoms(3, 0, 9); // select 3 of 9 in category at random
	trialStim = [c_cat[whichStim[0]], c_cat[whichStim[1]], c_cat[whichStim[2]]];

	// actually present the stimuli
	 showStim(trialStim, trialType);

	 //
	 if (trialNum < totalTrials+1){

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

// Actual stimuli
function showStim(trialStim, trialType){
	// show all the divs
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
			$("#pausePrompt").show()
		});

		$("#pausePrompt").click(function(){
			prompt.pause();
		});

  // Show button & images
		$("#playPrompt").show()
		$("#opt1Img").show();
  	$("#opt2Img").show();

	}

	else if (trialType = "v"){ // Run specifics for auditory prompt trials
		// Change file sources
		$("#promptImg").attr("src","stimuli/" + trialStim[0] + ".jpg");
		opt1 = new Audio("stimuli/" + trialStim[1] + ".mp3")
		opt2 = new Audio("stimuli/" + trialStim[2] + ".mp3")

		// Set up audio buttons
		$("#playOpt1").click(function(){
			opt1.play();
			$("#pauseOpt1").show()
		});

		$("#pauseOpt1").click(function(){
			opt1.pause();
		});

		$("#playOpt2").click(function(){
			opt2.play();
			$("#pauseOpt2").show()
		});

		$("#pauseOpt2").click(function(){
			opt2.pause();
		});

		// Show button & images
		$("#opt1Aud").show()
		$("#opt2Aud").show()
		$("#promptImg").show()
		$("#playOpt1").show();
  	$("#playOpt2").show();

	}

	// Listen for keypress
	detectKeyPress();

	//
	//saveTrialData();

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
