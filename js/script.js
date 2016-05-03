"use strict";

function Replacer(){}
Replacer.tag = function(outer, inner, tag){
  var tag = this;
  return("<" + tag + ">" + inner + "</" + tag + ">");
}
Replacer.prototype.replaceElement  = function(element){
  var instance  = this;
  var output    = h.collect(
    element.childNodes,
    instance.replaceNode.bind(instance)
  );
  return output.join("");
}
Replacer.prototype.replaceNode = function(node){
  var instance = this;
  var input;
  switch(node.nodeType){
    default:  // element
      input = node.outerHTML;
      break;
    case 3:   // text
      input = node.textContent;
      break;
    case 8:   // comment
      input = node.textContent;
      input = instance.swapEntities(input);
      input = instance.swapMultilines(input);
      input = instance.swapSingleLines(input);
      input = instance.swapInlines(input);
      break;
  }
  return input;
}
Replacer.prototype.swapEntities = function(input){
  var instance  = this;
  h.for_each(instance.matchers.entities, function(entity, character){
    var regex = RegExp(character, "gm");
    input = input.replace(regex, entity);
  });
  return input;
}
Replacer.prototype.swapMultilines = function(input){
  var instance  = this;
  h.for_each(instance.matchers.multiline, function(tag, regex){
    var regex = RegExp(regex, "gm");
    input = input.replace(regex, Replacer.tag.bind(tag));
  });
  return input;
}
Replacer.prototype.swapSingleLines = function(input){
  var instance  = this;
  var matchers  = [];
  var output    = "";
  h.for_each(instance.matchers.singleline, function(tag, delimeter){
    matchers.push([
      RegExp("^ *" + delimeter + " *(.*?)$", "g"),
      Replacer.tag.bind(tag)
    ]);
  });
  h.for_each(input.split(/[\n\r]/g), function(line){
    h.for_each(matchers, function(pair){
      line = line.replace(pair[0], pair[1]);
    });
    if(line.substring(0,1) != "<"){
      line = Replacer.tag.call("p", "", line);
    }
    output += line;
  });
  return output;
}
Replacer.prototype.swapInlines = function(input){
  var instance  = this;
  h.for_each(instance.matchers.inline, function(tag, delimeter){
    var regex = RegExp(delimeter + "(.*?)" + delimeter, "g");
    input = input.replace(regex, Replacer.tag.bind(tag));
  });
  return input;
}
Replacer.prototype.matchers = {
  entities: {
    "\\&":        "&amp;",
    "\\<":        "&lt;",
    "\\>":        "&gt;"
  },
  multiline: {
    "```([\\s\\S]*)```":  "pre" // \s\S matches across lines
  },
  singleline: {
    "#{4}":     "h4",
    "#{3}":     "h3",
    "#{2}":     "h2",
    "#{1}":     "h1",
    "''''":     "blockquote"
  },
  inline: {
    "___":      "i",
    "__":       "b",
    "`":        "code",
    "\\*\\*":   "strong",
    "\\*":      "em",
    "''":       "q",
    "~~":       "mark"
  }
}

window.onload = function(){
  var MD = new Replacer();
  h.for_each(document.querySelectorAll("[data-md]"), function(el){
    window.test = (MD.replaceElement(el));
    console.log(window.test)
  });
}