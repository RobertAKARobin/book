"use strict";

var fs        = require("fs");
var beaut     = require("js-beautify");
var matchers  = require("./js/markymarkdown.js");

var layout    = read("layouts/main.html").split("{{{yield}}}");
var filenames = [];
var book      = "";

read("./pages/_index.csv").split(/[\n\r]/).forEach(function(line, i){
  var data;
  if(!line || line == "") return;
  data = line.split(/ *# */)
  filenames.push({id: data[0], title: data[1] });
});

filenames.forEach(function(filename, i){
  var file = read("./pages/" + filename.id + ".html");
  var page = "";
  file.split(/[\n\r]/g).forEach(function(line){
    try{matchers.singleline.forEach(function(matcher){
      var raw = line;
      line    = matcher(line);
      if(line !== raw) throw "This is a cheat to let me 'break' the loop.";
    })}catch(e){};
    matchers.inline.forEach(function(matcher){
      line    = matcher(line);
    });
    page += line + "\n";
  });
  page = page.replace("{{title}}", function(){
    return "<a href=\"#" + filename.id + "\">" + filename.title + "</a>";
  });
  book += "<div id=\"" + filename.id + "\" class=\"section\">";
  book += page.split("=====").join("</div><div class=\"section\">");
  book += "</div>";
});

writePage("index.html", book);

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
