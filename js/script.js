"use strict";

function Replacer(){
  var instance  = this;
  instance.setMatchers();
}
Replacer.tag = function(outer, inner, tag){
  var tag = (this || tag);
  return("<" + tag + ">" + inner + "</" + tag + ">");
}
Replacer.prototype.setMatchers = function(){
  var instance  = this;
  h.for_each(instance.matchers.entities, function(matcher){
    matcher[2]  = (matcher[2] || RegExp(matcher[0], "g"));
  });
  h.for_each(instance.matchers.inline, function(matcher){
    matcher[2]  = (matcher[2] || RegExp(matcher[0] + "(.*?)" + matcher[0], "g"));
    matcher[3]  = (matcher[3] || Replacer.tag.bind(matcher[1]));
  });
  h.for_each(instance.matchers.singleline, function(matcher){
    matcher[2]  = (matcher[2] || RegExp("^" + matcher[0] + " *(.*)", "g"));
    matcher[3]  = (matcher[3] ? matcher[3].bind(instance) : Replacer.tag.bind(matcher[1]));
  });
}
Replacer.prototype.replaceElement = function(element){
  var instance  = this;
  var output    = h.collect(
    element.childNodes,
    instance.replaceNode.bind(instance)
  );
  return output.join("");
}
Replacer.prototype.replaceNode = function(node){
  var instance  = this;
  var output;
  switch(node.nodeType){
    default:  // element
      output    = node.outerHTML;
      break;
    case 3:   // text
      output    = node.textContent;
      break;
    case 8:   // comment
      output    = node.textContent;
      output    = instance.replaceText(output);
      break;
  }
  return output;
}
Replacer.prototype.replaceText = function(text){
  var instance  = this;
  instance.skipSingleLines = false;
  var output    = h.collect(
    text.split(/[\n\r]/g),
    instance.replaceLine.bind(instance)
  );
  return output.join("\n");
}
Replacer.prototype.replaceLine = function(line){
  var instance  = this;
  var output    = line;
  h.for_each(instance.matchers.entities, function(matcher){
    output      = output.replace(matcher[2], matcher[1]);
  });
  h.for_each(instance.matchers.singleline, function(matcher){
    var original= output;
    output      = output.replace(matcher[2], matcher[3]);
    if(original !== output) return "break";
  });
  h.for_each(instance.matchers.inline, function(matcher){
    output      = output.replace(matcher[2], matcher[3]);
  });
  return output;
}
Replacer.prototype.matchers = {
  entities: [
    ["\\&",   "&amp;"],
    ["\\<",   "&lt;"],
    ["\\>",   "&gt;"]
  ],
  inline: [
    ["_{3}",  "i"],
    ["_{2}",  "b"],
    ["`{1}",  "code"],
    ["\\*{2}","strong"],
    ["\\*{1}","em"],
    ["'{2}",  "q"],
    ["~{2}",  "mark"]
  ],
  singleline: [
    ["#{4}",  "h4"],
    ["#{3}",  "h3"],
    ["#{2}",  "h2"],
    ["#{1}",  "h1"],
    ["''''",  "blockquote"],
    [0, 0, /```/,     function newCodeBlock(){
      var instance = this;
      if(instance.isCodeBlock){
        instance.isCodeBlock  = false;
        return "</pre>";
      }else{
        instance.isCodeBlock  = true;
        return "<pre data-code>";
      }
    }],
    [0, 0, /^ *-/,    function listItem(){
      
    }],
    [0, 0, /^ *1\./,  function orderedList(){
      
    }],
    [0, 0, /^(.*?)$/, function defaultLine(outer, inner){
      if(inner.trim() === "") return "";
      else return Replacer.tag.call("p", null, inner);
    }]
  ]
}

window.onload = function(){
  var MD = new Replacer();
  h.for_each(document.querySelectorAll("[data-md]"), function(el){
    window.test = (MD.replaceElement(el));
    el.innerHTML = window.test;
    console.log(window.test)
  });
}