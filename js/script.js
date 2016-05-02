"use strict";

function Replacer(options){
  var instance = this;
  instance.matchers = Replacer.entityMatchers.slice();
  if(options.block) h.for_each(options.block, function(tag, delimeter){
    instance.matchers.push([
      RegExp("(?:^|\\n|\\r)" + delimeter + " *(.*?)" + "(?:\\n|\\r|$)", "g"),
      function(outer, inner){
        return("\n\r<" + tag + ">" + inner + "</" + tag + ">\n\r");
      }
    ]);
  });
  if(options.inline) h.for_each(options.inline, function(tag, delimeter){
    instance.matchers.push([
      RegExp(delimeter + "(.*?)" + delimeter, "g"),
      function(outer, inner){
        return("<" + tag + ">" + inner + "</" + tag + ">");
      }
    ]);
  });
}
Replacer.entityMatchers = (function(){
  var entities = {
    "<": "&lt;",
    ">": "&gt;"
  }
  return h.collect(entities, function(entity, character){
    return [RegExp(character, "g"), entity]
  });
})();
Replacer.prototype.replace = function(container){
  var instance = this;
  var childNodes = container.cloneNode(true).childNodes;
  container.innerHTML = "";
  h.for_each(childNodes, function(node){
    var html = node.textContent.replace(/(^[\n\r])|(\s*$)/g, "");
    if(node.nodeType != 8){
      html = node.outerHTML;
    }else{
      h.for_each(instance.matchers, function(pair){
        html = html.replace(pair[0], pair[1]);
      });
    }
    container.innerHTML += html;
  });
}

window.onload = function(){
  
  var codeReplacer = new Replacer({
    inline: {
      "___":      "i",
      "__":       "b",
      "\\*\\*":   "mark"
    }
  });
  var mdReplacer = new Replacer({
    inline: {
      "`":        "code",
      "\\*\\*":   "strong",
      "\\*":      "em",
      "\\\\\\\\": "q"
    },
    block: {
      "#{4}":     "h4",
      "#{3}":     "h3",
      "#{2}":     "h2",
      "#{1}":     "h1",
      "=":        "blockquote",
      " +": "p"
    }
  });

  h.for_each(document.querySelectorAll("[data-code]"), function(node){
    codeReplacer.replace(node);
  });
  h.for_each(document.querySelectorAll("[data-md]"), function(node){
    mdReplacer.replace(node);
  });
}