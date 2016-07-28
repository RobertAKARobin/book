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
      ["`{1}",,,      function inlineCode(nil, output){
        return h.tag("code", h.replaceEntities(output.trim()));
      }],
      [,,/^(.*)_{3}(.*)_{3}(.*)$/, function blankFlex(nil, openText, blankText, closeText){
        var output = "";
        if(openText.trim())  output += h.tag("span", openText);
        output += h.tag(["input", {class: "flex", "data-answer": blankText}]);
        if(closeText.trim()) output += h.tag("span", closeText);
        return h.tag(["span", {class: "line"}], output);
      }],
      ["_{2}",,,      function blankBlock(nil, output){
        return h.tag(["input", {class: "line", "data-answer": output}]);
      }],
      ["_{1}",,,      function blankInline(nil, output){
        var attributes = {"data-answer": output};
        return h.tag(["input", attributes]);
      }],
      [,,    / -- /g, " &mdash; "],
      [,,    /''\\/g, "&ldquo;"],
      [,,    /''\//g, "&rdquo;"],
      [,,    /\.{3}/g,"&hellip;"],
      ["\\/{2}","dfn"],
      ["\\*{2}","strong"],
      ["\\*{1}","em"],
      ["'{2}",  "q"],
      ["~{2}",  "mark"],
    ],
    singleline: [
      ["#{4}",  "h4"],
      ["#{3}",  "h3"],
      ["#{2}",  "h2"],
      ["#{1}",  "h1"],
      [,,/\[(.)\](.*)/,function checkbox(nil, isAnswer, label){
        var out = "";
        var inputAttr = {class: "checkbox"};
        if(isAnswer.trim()) inputAttr["data-answer"] = "x";
        out += "<label>";
        out += h.tag(["input", inputAttr]);
        out += h.tag("span", label.trim());
        out += "</label>";
        return out;
      }],
      [" *-(=|#)\/",,,function endList(nil, listType){
        return "</li></" + listTypes[listType] + ">";
      }],
      [" *-(=|#)",,,  function newList(nil, listType, output){
        return "<" + listTypes[listType] + "><li>" + output;
      }],
      [" *-",,,       function listItem(nil, output){
        return "</li><li>" + output;
      }],
      ["\\|\\\\",,,   function newTable(nil, cols){
        flag.cols = cols.split("|");
        return "<table>";
      }],
      ["\\|\\/",,,    function endTable(){
        flag.cols = null;
        return "</table>";
      }],
      ["\\|",,,       function tableRow(nil, row){
        var line = "";
        h.for_each(row.split(/ *\| */g), function(cell, index){
          var classAttr = "";
          if(flag.cols && flag.cols[index] && flag.cols[index].trim()){
            classAttr = {class: flag.cols[index].trim()};
          }
          line += h.tag(["td", classAttr], cell);
        });
        return h.tag("tr", line);
      }],
      ["```(#?)",,,   function newCodeBlock(nil, isNumbered){
        flag.insideCodeBlock = true;
        if(isNumbered) flag.lineNumber = 1;
        return "<pre>";
      }],
      ["``\\/",,,     function endCodeBlock(){
        flag.insideCodeBlock = false;
        flag.lineNumber = 0;
        return "</pre>";
      }],
      [">><<",,,      function newHTMLCodeBlock(nil, output){
        flag.insideHTMLCodeBlock = true;
        return "<div class=\"HTMLCodeBlock\">";
      }],
      [">><\/",,,     function endHTMLCodeBlock(nil, output){
        flag.insideHTMLCodeBlock = false;
        return "</div>";
      }],
      [,,/^\?{3}/,    function newFieldset(){
        return "<fieldset>";
      }],
      [,,/^\?{2}\//,  function endFieldset(){
        return "</fieldset>";
      }],
      [">",,,         function noFormatting(nil, output){
        return output;
      }],
      [,, /^(.*?)$/,  function fallback(nil, output){
        if(flag.insideCodeBlock){
          output = h.replaceEntities(output);
          if(flag.lineNumber){
            output = h.pad(flag.lineNumber, 3, ".") + "  " + output;
            flag.lineNumber += 1;
          }
        }else if(flag.insideHTMLCodeBlock){
          output = output.replace(/<.*?>/g, function(tag){
            var code = h.tag("code", h.replaceEntities(tag));
            if(tag.trim()[1] === "/") return "</span>" + code + tag;
            else return tag + code + "<span>";
          });
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
