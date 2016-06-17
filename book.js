"use strict";

var fs    = require("fs");
var beaut = require("js-beautify");
var h     = require("./js/helpers.js");
var layout= read("layouts/main.html").split("{{{yield}}}");
var div   = {
  open: "<div class=\"section\">",
  close: "</div>"
}
var pages = [];
var matchers  = require("./js/markymarkdown.js");
var filenames = require("./pages/_index");

h.for_each(filenames, function(filename, i){
  var file    = read("./pages/" + filename + ".html");
  var content = [];
  var contentString = "";
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
  contentString = content.join("\n");
  pages.push(contentString);
  // writePage("page_" + filename + ".html", contentString);
});

writePage("index.html", pages.join(div.close + div.open));

function read(filename){
  return fs.readFileSync(filename, "utf8");
}

function write(filename, content){
  return fs.writeFileSync(filename, (content || ""));
}

function writePage(filename, content){
  var output    = layout[0] + div.open + content + div.close + layout[1];
  write(filename, beaut.html(output, {
    indent_size: 2,
    end_with_newline: true
  }));
}
