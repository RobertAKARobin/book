"use strict";

var fs    = require("fs");
var h     = require("./js/helpers.js");
var pages = [];

(function loadPages(){
  
  var matchers  = require("./js/markymarkdown.js");
  var filenames = require("./pages/_index");
  h.for_each(filenames, function(filename, i){
    var file    = read("./pages/" + filename + ".md");
    var content = [];
    h.for_each(file.split(/[\n\r]/g), function(line){
      h.for_each(matchers.singleline, function(matcher){
        var raw = line;
        line    = matcher(line);
        if(line !== raw) return "break";
      });
      h.for_each(matchers.inline, function(matcher){
        line    = matcher(line);
      });
      content.push(line);
    });
    pages.push(content.join("\n"));
  });
  
})();

(function insertPages(){
  
  var index     = read("layout.html").split("{{{yield}}}");
  var output    = index[0] + "<section>" + pages.join("</section><section>") + "</section>" + index[1];
  write("index.html", output);
  
})();

function read(filename){
  return fs.readFileSync(filename, "utf8");
}

function write(filename, content){
  return fs.writeFileSync(filename, (content || ""));
}