var pretestStim = ["sunny", "ocean", "hello", "apple"];

$(document).ready(function(){

  $("#landingButton").click(function(){runPretest()})

});

function runPretest(){

    $("#landingPage").hide();
    $("#preTest").show()

    // Select word & change pretest audio to that recording
    curr_word = pretestStim[getRandomInt(3)];
    $("#testsound").attr("src", "stimuli/" + curr_word + ".mp3")

    // For the selected word, change associated button to "correct"
    $("#" + curr_word).addClass("corr").removeClass("wrong")

    // Show pretest div (audio + sounds)
    $("#preTest").show();

    // If button labeled correct is click, show task button
    $(".corr").click(function(){
      $("#success").show()
      $(".corr").hide()
      $(".wrong").hide()
    });

    // If any button labeled wrong correct, show "not eligible" message
    $(".wrong").click(function(){
      $("#failedpretask").show()
      $(".corr").hide()
      $(".wrong").hide()
    });

  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
