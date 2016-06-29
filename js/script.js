"use strict";

$(document).ready(function(){
  var fak = 0;
  (function addAnswerChecker(){
    var $score   = $("#score");
    var $correct = $("#correct");
    var $total   = $("#total");
    var $clear   = $("#clear");
    var $inputs  = $("input");
    var guesses  = JSON.parse(localStorage.getItem("guesses") || "{}");

    $inputs.each(function(index, input){
      var $input = $(input);
      var guess  = (guesses[index] || "");
      $input.val(guess);
      if($input.hasClass("checkbox")) $input.on("click", toggleCheckbox);
      else $input.on("keyup", checkAnswer);
      checkAnswer.call($input);
    });
    countNumberCorrect();
    $total.html($("input[data-answer]").length);
    $clear.on("click", clearAnswers);

    function toggleCheckbox(event){
      var $input = $(this);
      $input.val( $input.val() === "x" ? "" : "x");
      $input.blur();
      checkAnswer.call($input, event);
    }

    function checkAnswer(event){
      var $input  = $(this);
      var answer  = $input.attr("data-answer");
      var guess   = $input.val();
      var index   = $inputs.index($input);
      guesses[index] = (guess || "");
      if(guess && answer && standardize(guess) == standardize(answer)){
        $input.addClass("correct");
        countNumberCorrect();
        scoreVisualFeedback();
      }else if($input.hasClass("correct")){
        $input.removeClass("correct");
        countNumberCorrect();
      }
      saveProgress();
    }

    function scoreVisualFeedback(){
      $score.addClass("active");
      setTimeout(function(){
        $score.removeClass("active");
      }, 500);
    }

    function clearAnswers(){
      guesses = {};
      $inputs.each(function(index, input){
        var $input = $(input);
        $input.val("").removeClass("correct");
      });
      countNumberCorrect();
      saveProgress();
    }

    function countNumberCorrect(){
      $correct.html($(".correct").length);
    }

    function saveProgress(){
      localStorage.setItem("guesses", JSON.stringify(guesses || {}));
    }

  })();

  function standardize(input){
    return $.trim(input.toLowerCase());
  }

});
