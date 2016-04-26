"use strict";

window.onload = function(){
  
  h.for_each(document.querySelectorAll("[data-code]"), function(codeBlock){
    var childNodes = codeBlock.cloneNode(true).childNodes;
    codeBlock.innerHTML = "";
    h.for_each(childNodes, function(node){
      var el = {};
      if(node.nodeType === 8){
        switch(node.textContent.substring(0,1)){
          case "_":
            el = document.createElement("B");
            el.textContent = node.textContent.substring(1);
            break;
          case "*":
            el = document.createElement("MARK");
            el.textContent = node.textContent.substring(1);
            break;
          default:
            el = document.createElement("CODE");
            el.textContent = node.textContent;
        }
      }else{
        el = node.cloneNode(true);
      }
      codeBlock.appendChild(el);
    });
  });
  
}