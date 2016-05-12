"use strict";

var fs    = require("fs");
var h     = require("./js/helpers.js");

(function loadPages(){
  
  var matchers  = require("./js/markymarkdown.js");
  var filenames = require("./pages/_index");
  h.for_each(filenames, function(filename, i){
    var file  = read("./pages/" + filename + ".md");

  });
  
})();

(function insertPages(){
  
  var index     = read("index.html").split("{{{yield}}}");
  
})();

function read(filename){
  return fs.readFileSync(filename, "utf8");
}

function write(filename){
  return fs.writeFileSync(filename, "utf8");
}