"use strict";

function MarkyMarkdown(){
  var instance  = this;
  instance.setMatchers();
}
MarkyMarkdown.tag = function(outer, inner, tag){
  var tag = (this || tag);
  return("<" + tag + ">" + inner + "</" + tag + ">");
}
MarkyMarkdown.for_cells_at = function(rows, indexes, doWhat){
  h.for_each(rows, function(row){
    h.for_each(row.children, function(td, index){
      if([2, 3, 4].includes(index)){
        td.setAttribute("data-code", true);
      }
    });
  })
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
  var output    = line.toString();
  h.for_each(instance.matchers.singleline, function(matcher){
    var original= output;
    output      = output.replace(matcher[2], matcher[3]);
    if(original !== output) return "break";
  });
  output        = instance.replaceInline(output);
  return output;
}
MarkyMarkdown.prototype.replaceInline = function(line){
  var instance  = this;
  var output    = line.toString();
  h.for_each(instance.matchers.inline, function(matcher){
    output      = output.replace(matcher[2], matcher[3]);
  });
  return output;
}
MarkyMarkdown.prototype.replaceEntities = function(output){
  var instance  = this;
  h.for_each(instance.matchers.entities, function(matcher){
    output      = output.replace(matcher[2], matcher[1]);
  });
  return output;
}
MarkyMarkdown.prototype.stringToTbody = function(string){
  var tbody  = document.createElement("TBODY");
  var output = "<tbody>";
  h.for_each(string.split(/[\n\r]/g), function(row){
    output   += "<tr><td></td>";
    h.for_each(row.split(/ +/g), function(cell){
      output += "<td>" + MD.replaceInline(cell) + "</td>";
    });
    output   += "</tr>";
  });
  tbody.innerHTML = output;
  return tbody;
}
MarkyMarkdown.prototype.listTypes = {
  "#": "ol",
  "=": "ul"
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
      return "<span class='line'><span>" + output + "</span><b></b></span>";
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
      var instance = this;
      return "</li></" + instance.listTypes[listType] + ">";
    }],
    [" *-(=|#)",0,0,  function newList(nil, listType, output){
      var instance = this;
      return "<" + instance.listTypes[listType] + "><li>" + output;
    }],
    [" *-", 0, 0,     function listItem(nil, output){
      return "</li><li>" + output;
    }],
    [0,0,/\/{2}={1} *(.*?)/,function newTable(nil, output){
      return "<table><tr><td></td><td>";
    }],
    [0,0,/\/{1}={2} *(.*?)/,function tableRow(nil, output){
      return "</td></tr><tr><td></td><td>" + output;
    }],
    [0,0,/={3} *(.*?)/,function tableCell(nil, output){
      return "</td><td>" + output;
    }],
    [0,0,/={1}\/{2}/,    function tableEnd(){
      return "</td></tr></table>";
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