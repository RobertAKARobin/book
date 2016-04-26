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
  
  h.for_each(document.querySelectorAll("[data-md]"), function(codeBlock){
    var raw = codeBlock.textContent.split(/[\n\r]/);
    var blocks = [
      [/^#{1}[^#]\s*(.*)$/g,  "h1"],
      [/^#{2}[^#]\s*(.*)$/g,  "h2"],
      [/^#{3}[^#]\s*(.*)$/g,  "h3"],
      [/^#{4}[^#]\s*(.*)$/g,  "h4"],
      [/^\>\s*(.*)/g,         "blockquote"],
      [/^(.*)$/g,             "p"]
    ];
    codeBlock.innerHTML = "";
    h.for_each(raw, function(line){
      var next = false;
      if(line.trim() === "") return;
      h.for_each(blocks, function(match){
        var el  = match[1];
        line = line.replace(match[0], function(match, inner){
          next = true;
          return "<" + el + ">" + inner + "</" + el + ">";
        });
        if(next) return "break";
      });
      codeBlock.innerHTML += line;
    });
  });
  
}