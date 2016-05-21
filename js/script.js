"use strict";

window.onload = function(){

  (function addInputSwapper(){
    var answer    = "";
    var target    = {};

    h.for_each(h.el("b"), function(el, index){
      el.addEventListener("click", focus);
      el.addEventListener("focus", makeEditable);
      el.addEventListener("blur", makeUneditable);
      el.setAttribute("tabindex", index + 1);
    });
    document.addEventListener("keyup", checkAnswer);

    function focus(evt){
      var el          = this;
      el.focus();
    }

    function makeEditable(evt){
      var el          = this;
      if(!el.hasAttribute("answer")) firstEverEdit(el);
      target.el       = el;
      target.answer   = el.getAttribute("answer");
      if(el.textContent.trim().length < 1){
        el.textContent= "";
      }
      el.setAttribute("contenteditable", true);
    }

    function firstEverEdit(el){
      el.classList.add("tainted");
      el.setAttribute("answer", el.textContent);
      if(!el.classList.contains("line")){
        el.style.width  = el.offsetWidth + "px";
      }
      el.textContent  = "";
    }

    function checkAnswer(evt){
      var el      = target.el;
      if(!el) return;
      if(el.textContent === target.answer){
        el.classList.add("correct");
      }else{
        el.classList.remove("correct");
      }
    }

    function makeUneditable(evt){
      var el      = this;
      target      = {};
      el.removeAttribute("contenteditable");
      if(el.textContent.length < 1){
        el.textContent = "\xa0";
      }
    }
  })();

}
