"use strict";

window.onload = function(){
  h.for_each(document.querySelectorAll("section"), function(el){
    el.innerHTML = MD.replaceElement(el);
  });
}
