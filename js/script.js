"use strict";

window.onload = function(){
  h.for_each(h.el("[data-code-cols]"), function(el){
    var indexes = el.getAttribute("data-code-cols").split(/ +/g);
    h.for_each(h.el("tr", el), function(row){
      h.for_each(row.children, function(td, index){
        if(indexes.includes(index.toString())){
          td.setAttribute("data-code", true);
        }
      });
    });
  });
  
  h.for_each(h.el("td b"), function(el){
    if(!el.previousSibling && !el.nextSibling){
      el.classList.add("line");
    }
  });
}
