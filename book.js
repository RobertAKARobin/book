"use strict";

var fs    = require("fs");
var beaut = require("js-beautify");
var h     = require("./js/helpers.js");
var layout= read("layouts/main.html").split("{{{yield}}}");
var pages = [];
var matchers  = require("./js/markymarkdown.js");
var filenames = [];

read("./pages/_index.csv").split(/[\n\r]/).forEach(function(line, i){
  var data;
  if(!line || line == "") return;
  data = line.split(/ *# */)
  filenames.push({id: data[0], title: data[1] });
});

filenames.forEach(function(filename, i){
  var file    = read("./pages/" + filename.id + ".html");
  var content = [];
  var contentString = "";
  file.split(/[\n\r]/g).forEach(function(line){
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
  contentString = "<div id=\"" + filename.id + "\" class=\"section\">" + contentString + "</div>";
  contentString = contentString.replace("{{title}}", function(){
    return "<a href=\"#" + filename.id + "\">" + filename.title + "</a>";
  });
  pages.push(contentString);
});

writePage("index.html", pages.join("\n"));

function read(filename){
  return fs.readFileSync(filename, "utf8");
}

function write(filename, content){
  return fs.writeFileSync(filename, (content || ""));
}

function writePage(filename, content){
  var output    = layout[0] + content + layout[1];
  write(filename, beaut.html(output, {
    indent_size: 2,
    end_with_newline: true
  }));
}
