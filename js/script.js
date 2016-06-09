"use strict";

window.onload = function(){

  (function addAnswerChecker(){
    var elScore   = document.getElementById("score");
    var elCorrect = document.getElementById("correct");
    var elTotal   = document.getElementById("total");
    var elClear   = document.getElementById("clear");
    var inputs    = html_array("input[data-answer]");
    var guesses   = JSON.parse(localStorage.getItem("guesses") || "{}");

    inputs.forEach(function(input, i){
      input.setAttribute("value", guesses[i] || "");
      input.setAttribute("data-qnum", i);
      input.addEventListener("input", checkAnswer);
      checkAnswer.call(input);
    })
    countNumberCorrect();
    elTotal.innerHTML = inputs.length;
    elClear.addEventListener("click", clearAnswers);


    function checkAnswer(event){
      var input   = this;
      var answer  = input.getAttribute("data-answer");
      var guess   = input.value;
      var index   = inputs.indexOf(input);
      guesses[index] = guess;
      if(guess.toLowerCase().trim() == answer.toLowerCase().trim()){
        input.classList.add("correct");
        countNumberCorrect();
        scoreVisualFeedback();
      }else if(input.classList.contains("correct")){
        input.classList.remove("correct");
        countNumberCorrect();
      }
      saveProgress();
    }

    function scoreVisualFeedback(){
      elScore.classList.add("active");
      setTimeout(function(){
        elScore.classList.remove("active");
      }, 500);
    }

    function clearAnswers(){
      guesses = {};
      inputs.forEach(function(input){
        input.value = "";
        input.classList.remove("correct");
      });
      countNumberCorrect();
      saveProgress();
    }

    function countNumberCorrect(){
      elCorrect.innerHTML = document.querySelectorAll(".correct").length;
    }

    function saveProgress(){
      localStorage.setItem("guesses", JSON.stringify(guesses || {}));
    }

  })();

  function html_array(selector){
    var els     = document.querySelectorAll(selector);
    var output  = [];
    Object.keys(els).forEach(function(key){
      output.push(els[key]);
    });
    return output;
  }

}
