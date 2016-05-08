"use strict";

function MarkyMarkdown(){
  var instance  = this;
  instance.setMatchers();
}
MarkyMarkdown.tag = function(outer, inner, tag){
  var tag = (this || tag);
  return("<" + tag + ">" + inner + "</" + tag + ">");
}
MarkyMarkdown.prototype.setMatchers = function(){
  var instance  = this;
  h.for_each(instance.matchers.entities, function(matcher){
    matcher[2]  = (matcher[2] || RegExp(matcher[0], "g"));
  });
  h.for_each(instance.matchers.inline, function(matcher){
    matcher[2]  = (matcher[2] || RegExp(matcher[0] + "(.*?)" + matcher[0], "g"));
    matcher[3]  = (matcher[3] ? matcher[3].bind(instance) : MarkyMarkdown.tag.bind(matcher[1]));
  });
  h.for_each(instance.matchers.singleline, function(matcher){
    matcher[2]  = (matcher[2] || RegExp("^" + matcher[0] + " *(.*)", "g"));
    matcher[3]  = (matcher[3] ? matcher[3].bind(instance) : MarkyMarkdown.tag.bind(matcher[1]));
  });
}
MarkyMarkdown.prototype.replaceElement = function(element){
  var instance  = this;
  var output    = h.collect(
    element.childNodes,
    instance.replaceNode.bind(instance)
  );
  return output.join("");
}
MarkyMarkdown.prototype.replaceNode = function(node){
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
MarkyMarkdown.prototype.replaceText = function(text){
  var instance  = this;
  instance.line = {};
  var output    = h.collect(
    text.split(/[\n\r]/g),
    instance.replaceLine.bind(instance)
  );
  return output.join("\n");
}
MarkyMarkdown.prototype.replaceLine = function(line){
  var instance  = this;
  var output    = line;
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
MarkyMarkdown.prototype.replaceEntities = function(output){
  var instance = this;
  h.for_each(instance.matchers.entities, function(matcher){
    output = output.replace(matcher[2], matcher[1]);
  });
  return output;
}
MarkyMarkdown.prototype.matchers = {
  entities: [
    ["\\&",   "&amp;"],
    ["\\<",   "&lt;"],
    ["\\>",   "&gt;"]
  ],
  inline: [
    ["`{1}",  0, 0,   function inlineCode(nil, output){
      var instance  = this;
      var output    = instance.replaceEntities(output);
      return MarkyMarkdown.tag.call("code", null, output);
    }],
    ["_{3}",  0, 0,   function blankBlock(nil, output){
      return "<b class='line'>" + output + "</b>";
    }],
    ["_{2}",  0, 0,   function blankInlineBlock(nil, output){
      var out = "<span class='line'><span>" + output + "</span><b></b></span>";
      console.log(out)
      return out;
    }],
    ["_{1}",  "b"],
    ["\\/{2}","dfn"],
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
    ["\\|", 0, 0,     function preserveHTML(nil, output){
      return output;
    }],
    [" *-(=|#)\/",0,0,function endList(nil, listType){
      var listType = ({"#": "ol", "=": "ul"})[listType];
      return "</li></" + listType + ">";
    }],
    [" *-(=|#)",0,0,  function newList(nil, listType, output){
      var listType = ({"#": "ol", "=": "ul"})[listType];
      return "<" + listType + "><li>" + output;
    }],
    [" *-", 0, 0,     function listItem(nil, output){
      return "</li><li>" + output;
    }],
    [0, 0, /```/,     function newCodeBlock(){
      var instance = this;
      if(instance.line.codeBlock){
        instance.line.codeBlock  = false;
        return "</pre>";
      }else{
        instance.line.codeBlock  = true;
        return "<pre data-code>";
      }
    }],
    [0, 0, /^(.*?)$/, function fallback(nil, output){
      var instance = this;
      if(instance.line.codeBlock){
        output = instance.replaceEntities(output);
      }else if(output.trim() === ""){
        output = "";
      }else if(output.substring(0,1) === "<"){
        output = output;
      }else{
        output = MarkyMarkdown.tag.call("p", null, output);
      }
      return output;
    }]
  ]
}