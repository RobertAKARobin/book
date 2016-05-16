"use strict";

window.onload = function(){
  h.for_each(h.el("td b"), function(el){
    if(!el.previousSibling && !el.nextSibling){
      el.classList.add("line");
    }
  });
}
