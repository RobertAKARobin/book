"use strict";

window.onload = function(){
  
  h.for_each(document.querySelectorAll("[data-code]"), function(codeBlock){
    var childNodes = codeBlock.cloneNode(true).childNodes;
    var splitter   = [];
    var matchers   = [];
    var delimeters = [
      ["___",     "i"],
      ["__",      "b"],
      ["\\*\\*",  "mark"]
    ];
    h.for_each(delimeters, function(delimeter){
      var chars = delimeter[0], tag = delimeter[1];
      splitter.push(chars + ".*?" + chars);
      matchers.push([RegExp(chars + "(.*?)" + chars, "gm"), tag]);
    });
    splitter = RegExp("(" + splitter.join("|") + ")", "gm");
    codeBlock.innerHTML = "";
    h.for_each(childNodes, function(node){
      if(node.nodeType !== 8){
        codeBlock.appendChild(node.cloneNode(true));
      }else{
        h.for_each(node.textContent.split(splitter), function(chunk){
          var el = document.createElement("SPAN");
          h.for_each(matchers, function(pair){
            if(pair[0].test(chunk)){
              el = document.createElement(pair[1]);
              chunk = chunk.replace(pair[0], function(outer, inner){
                return inner;
              });
              return "break";
            }
          });
          el.textContent = chunk;
          codeBlock.appendChild(el);
        });
      }
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
    var inlines = [
      [/`(.*)?`/g,          "code"],
      [/\*\*(.*)?\*\*/g,    "strong"],
      [/\*(.*)?\*/g,        "em"],
      [/\\\\(.*)?\\\\/g,     "q"]
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
      h.for_each(inlines, function(match){
        var el  = match[1];
        line = line.replace(match[0], function(match, inner){
          return "<" + el + ">" + inner + "</" + el + ">";
        });
      });
      codeBlock.innerHTML += line;
    });
  });
  
}