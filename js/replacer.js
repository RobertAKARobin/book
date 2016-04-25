"use strict";

var entities = new (require("html-entities").AllHtmlEntities)();
var replacers = {};
var patterns = [
  ["code", "#", "", ""],
  ["blank", "?", '<span class="blank">', '</span>'],
  ["mark", "*", "<mark>", "</mark>"]
]
patterns.forEach(function(pattern){
  var mark = pattern[1];
  var regex = new RegExp("<\\" + mark + "+\\|((.|[\\n\\r])+?)\\|\\" + mark + "+>", "mg");
  replacers[pattern[0]] = function(string){
    return string.replace(regex, function(match, innerGroup){
      return pattern[2] + entities.encode(innerGroup) + pattern[3];
    });
  }
});
replacers.replaceAll = function(string){
  var type;
  for(type in replacers){
    if(type !== "replaceAll") string = replacers[type](string);
  }
  return string;
}
module.exports = replacers;
