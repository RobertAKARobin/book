"use strict";

$(document).ready(function(){

  (function focusOnFirstInput(){
    var $searchInside = $(window.location.hash || "body");
    var scrollTop = $(window).scrollTop();
    // Timer necessary b/c otherwise executes too fast. Wat.
    setTimeout(function(){
      $searchInside.find("input").eq(0).focus();
      window.scrollTo(0,scrollTop);
    },2);
  })();

  (function addAnswerChecker(){
    var $nav     = $("#nav");
    var $score   = $("#score");
    var $correct = $("#scoreCorrect");
    var $clear   = $("#scoreClear");
    var $inputs  = $("input");
    var guesses  = JSON.parse(localStorage.getItem("guesses") || "{}");
    var correct  = 0;
    var total    = $("input[data-answer]").length;

    $inputs.each(function(index, input){
      var $input = $(input);
      var guess  = (guesses[index] || "");
      $input.val(guess);
      if($input.hasClass("checkbox")){
        $input.on("click", toggleCheckbox);
      }else{
        $input.on("input", checkAnswer);
      }
      checkAnswer.call($input);
    });
    countNumberCorrect();
    $clear.on("click", function(){
      if(confirm("Do you want to clear all your answers?")){
        clearAnswers();
      }
    });

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
      $nav.addClass("active");
      setTimeout(function(){
        $nav.removeClass("active");
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
      correct = $(".correct").length;
      $correct.html(correct);
      $score.width((correct / total * 100) + "%");
    }

    function saveProgress(){
      localStorage.setItem("guesses", JSON.stringify(guesses || {}));
    }

    function standardize(input){
      return $.trim(input.toLowerCase());
    }

  })();

});
