"use strict";

window.onload = function(){

  (function addAnswerChecker(){
    var elScore   = document.getElementById("score");
    var elCorrect = document.getElementById("correct");
    var elTotal   = document.getElementById("total");
    var elClear   = document.getElementById("clear");
    var elRemember= document.getElementById("remember");
    var doRemember= false;
    var inputs    = [];
    var guesses   = {};

    elClear.addEventListener("click", clearAnswers);
    elRemember.addEventListener("click", toggleSaving);

    convertBlanksToInputs();
    guesses = JSON.parse(localStorage.getItem("guesses"));
    if(guesses){
      elRemember.click();
      inputs.forEach(function(input, i){
        input.setAttribute("value", guesses[i] || "");
        checkAnswer.call(input);
      });
    }else guesses = {};
    countNumberCorrect();
    elTotal.innerHTML = inputs.length;

    function convertBlanksToInputs(){
      var blank, input, answer;
      var blanks    = document.querySelectorAll("b");
      var i,      l = blanks.length;

      // Set widths of blanks
      for(i = 0; i < l; i++){
        blank       = blanks[i];
        blank.setAttribute("data-width", blank.clientWidth + 1);
      }
      // Convert blanks to inputs
      for(i = 0; i < l; i++){
        blank       = blanks[i];
        input       = document.createElement("INPUT");
        answer      = blank.textContent.toLowerCase().trim();
        input.type  = "text";
        input.setAttribute("data-answer", answer);
        input.setAttribute("data-qnum", i);
        input.className = blank.className;
        input.addEventListener("input", checkAnswer);
        inputs.push(input);
        if(!blank.classList.contains("flex")){
          input.style.width = blank.getAttribute("data-width") + "px";
        }
        blank.parentElement.replaceChild(input, blank);
      }
    }

    function checkAnswer(event){
      var input   = this;
      var answer  = input.getAttribute("data-answer");
      var guess   = input.value.toLowerCase().trim();
      var index   = inputs.indexOf(input);
      guesses[index] = guess;
      if(guess == answer){
        input.classList.add("correct");
        countNumberCorrect();
        elScore.classList.add("active");
        setTimeout(function(){
          elScore.classList.remove("active");
        }, 500);
      }else if(input.classList.contains("correct")){
        input.classList.remove("correct");
        countNumberCorrect();
      }
      saveProgress();
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
      if(doRemember) localStorage.setItem("guesses", JSON.stringify(guesses || {}));
    }

    function toggleSaving(event){
      doRemember = this.checked;
      if(doRemember) saveProgress();
      else localStorage.removeItem("guesses");
    }

  })();

}
