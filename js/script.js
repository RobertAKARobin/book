"use strict";

function Replacer(){}
Replacer.tag = function(outer, inner, tag){
  var tag = this;
  return("<" + tag + ">" + inner + "</" + tag + ">");
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
  var output    = h.collect(
    text.split(/[\n\r]/g),
    instance.replaceLine.bind(instance)
  );
  return output.join("\n");
}
Replacer.prototype.replaceLine = function(line){
  var instance  = this;
  var output    = line;
  if(line === "```"){
    if(instance.isCodeBlock){
      instance.isCodeBlock  = false;
      return "</pre>";
    }else{
      instance.isCodeBlock  = true;
      return "<pre data-code>";
    }
  }
  if(line.trim() === ""){
    return null;
  }
  h.for_each(instance.matchers.entities, function(matcher){
    matcher[2]  = (matcher[2] || RegExp(matcher[0], "g"));
    output      = output.replace(matcher[2], matcher[1]);
  });
  if(!instance.isCodeBlock) h.for_each(instance.matchers.singleline, function(matcher){
    var original= output;
    matcher[2]  = (matcher[2] || RegExp("^" + matcher[0] + " *(.*)", "g"));
    matcher[3]  = (matcher[3] || Replacer.tag.bind(matcher[1]));
    output      = output.replace(matcher[2], matcher[3]);
    if(original !== output) return "break";
  });
  h.for_each(instance.matchers.inline, function(matcher){
    matcher[2]  = (matcher[2] || RegExp(matcher[0] + "(.*?)" + matcher[0], "g"));
    matcher[3]  = (matcher[3] || Replacer.tag.bind(matcher[1]));
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
  singleline: [
    ["#{4}",  "h4"],
    ["#{3}",  "h3"],
    ["#{2}",  "h2"],
    ["#{1}",  "h1"],
    ["''''",  "blockquote"],
    ["",      "p"]
  ],
  inline: [
    ["_{3}",  "i"],
    ["_{2}",  "b"],
    ["`{1}",  "code"],
    ["\\*{2}","strong"],
    ["\\*{1}","em"],
    ["'{2}",  "q"],
    ["~{2}",  "mark"]
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