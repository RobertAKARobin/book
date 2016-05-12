"use strict";

var h         = require("./helpers");
var module    = (module || {});
module.exports= (function(){
  var flag      = {};
  var listTypes = {
    "#": "ol",
    "=": "ul"
  }
  var matchers  = {
    inline: [
      ["`{1}",  0, 0,   function inlineCode(nil, output){
        return h.tag("code", h.replaceEntities(output));
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
      [" *-(=|#)\/",0,0,function endList(nil, listType){
        return "</li></" + listTypes[listType] + ">";
      }],
      [" *-(=|#)",0,0,  function newList(nil, listType, output){
        return "<" + listTypes[listType] + "><li>" + output;
      }],
      [" *-", 0, 0,     function listItem(nil, output){
        return "</li><li>" + output;
      }],
      ["\\|",     0, 0, function dataTableRow(nil, row){
        var line  = "<td></td>";
        h.for_each(row.split(/ *\| */g), function(cell){
          line    += "<td>" + cell + "</td>";
        });
        return "<tr>" + line + "</tr>";
      }],
      ["```", 0, 0,     function newCodeBlock(){
        flag.insideCodeBlock = true;
        return "<pre data-code>";
      }],
      ["``\\/",0, 0,    function endCodeBlock(){
        flag.insideCodeBlock = false;
        return "</pre>";
      }],
      [0, 0, /^(.*?)$/, function fallback(nil, output){
        if(flag.insideCodeBlock){
          output = h.replaceEntities(output);
        }else if(output.trim() === ""){
          output = "";
        }else if(output.substring(0,1) === "<"){
          output = output;
        }else{
          output = h.tag("p", output);
        }
        return output;
      }]
    ]
  }
  
  var output = {
    inline:     [],
    singleline: []
  }
  
  h.for_each(matchers.inline, function(matcher, index){
    output.inline.push(setReplacer(matcher, RegExp(matcher[0] + "(.*?)" + matcher[0], "g")));
  });
  h.for_each(matchers.singleline, function(matcher, index){
    output.singleline.push(setReplacer(matcher, RegExp("^" + matcher[0] + " *(.*)", "g")));
  });
  
  function setReplacer(matcher, regex){
    var regex     = (matcher[2] || regex);
    var replacer  = (matcher[3] ? matcher[3] : h.tag.bind(matcher[1]));
    return function(input){
      return input.replace(regex, replacer);
    }
  }
  
  return output;
  
})();