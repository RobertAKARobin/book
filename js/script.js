"use strict";

window.onload = function(){
  var MD = new MarkyMarkdown();
  h.for_each(document.querySelectorAll("section"), function(el){
    el.innerHTML = MD.replaceElement(el);
  });
}
