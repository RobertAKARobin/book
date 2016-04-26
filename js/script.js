"use strict";

window.onload = function(){
  
  var codeBlocks  = document.querySelectorAll("[data-code]");
  h.for_each(codeBlocks, function(codeBlock){
    var childNodes = codeBlock.cloneNode(true).childNodes;
    codeBlock.innerHTML = "";
    h.for_each(childNodes, function(node){
      var el = {};
      if(node.nodeType === 8){
        el = document.createElement("CODE");
        el.textContent = node.textContent;
      }else{
        el = node.cloneNode(true);
      }
      codeBlock.appendChild(el);
    });
  });
  
}