"use strict";

window.onload = function(){

  (function addAnswerChecker(){
    var el, input, answer;
    var blanks    = document.querySelectorAll("b");
    var i,      l = blanks.length;
    for(i = 0; i < l; i++){
      el          = blanks[i];
      el.setAttribute("data-width", el.clientWidth + 1);
    }
    for(i = 0; i < l; i++){
      el          = blanks[i];
      input       = document.createElement("INPUT");
      answer      = el.textContent.toLowerCase().trim();
      input.type  = "text";
      input.setAttribute("data-answer", answer);
      input.className = el.className;
      input.addEventListener("input", checkAnswer);
      if(!el.classList.contains("flex")){
        input.style.width = el.getAttribute("data-width") + "px";
      }
      el.parentElement.replaceChild(input, el);
    }
    function checkAnswer(evt){
      var el      = this;
      var answer  = el.getAttribute("data-answer");
      var input   = el.value.toLowerCase().trim();
      if(input == answer) el.classList.add("correct");
      else el.classList.remove("correct");
    }
  })();

}
