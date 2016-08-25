"use strict";

var fs        = require("fs");
var beaut     = require("js-beautify");
var sass      = require("node-sass");
var matchers  = require("./js/markymarkdown.js");

(function compileSASS(){
  write("css/style.css", sass.renderSync({
    file:         "css/style.scss",
    outputStyle:  "expanded",
    sourceMap:    false
  }).css.toString());
})();

(function compileHTML(){
  var book      = "";
  var leafNum   = 0;
  var layout    = {
    base: read("./layouts/base.html"),
    defaultPage: read("./layouts/defaultPage.html"),
    otherPage: read("./layouts/otherPage.html")
  }
  var viewVars  = {
    pageNum:      0,
    sectionName:  null,
    bookTitle:    "Learn some code in about two hours without a computer!",
    pageTitle:    null
  }

  require("./sections/_index").forEach(function(sectionData){
    var section = {
      name: (sectionData.name || sectionData),
      id: null,
      hasPageNumbers: (sectionData.hasPageNumbers !== false),
      layout: layout[sectionData.layout || "defaultPage"],
      pageNumOfSection: -1
    }
    section.id = section.name.replace(/ /g, "_").toLowerCase();
    viewVars.sectionName = section.name;
    read("./sections/" + section.id + ".html").split(/\s*={5}\s*/).forEach(function(page){
      leafNum += 1;
      section.pageNumOfSection += 1;
      if(section.hasPageNumbers){
        viewVars.pageNum += 1;
      }
      if(leafNum % 2 === 0 && section.hasPageNumbers){
        viewVars.pageTitle = viewVars.sectionName;
      }else{
        viewVars.pageTitle = viewVars.bookTitle;
      }
      if(section.pageNumOfSection === 0){
        viewVars.pageID = section.id;
      }else{
        viewVars.pageID = viewVars.pageNum;
      }
      page = markyMark(page);
      page = section.layout.replace("{{body}}", page);
      page = insertVars(page);
      if(leafNum % 2 !== 0) book += "<div class=\"sheet\">" + page;
      else book += page + "</div>";
    });
  });

  if(leafNum % 2 !== 0) book += "<div class=\"page\"></div></div>";

  book = layout.base.replace("{{body}}", book);
  book = insertVars(book);

  writePage("index.html", book);

  function insertVars(input){
    return input.replace(/\{\{(.*?)}}/g, function(nil, varName){
      return viewVars[varName];
    });
  }
})();

function read(filename){
  return fs.readFileSync(filename, "utf8");
}

function write(filename, content){
  return fs.writeFileSync(filename, (content || ""));
}

function writePage(filename, content){
  write(filename, beaut.html(content, {
    indent_size: 2,
    end_with_newline: true
  }));
}

function markyMark(input){
  var output = "";
  input.split(/[\n\r]/g).forEach(function(line){
    if(line.charAt(0) === "!"){
      line = line.substring(1);
    }else{
      try{
        matchers.singleline.forEach(function(matcher){
          var raw = line;
          line = matcher(line);
          if(line !== raw) throw "break";
        });
      }catch(e){ /*This is a cheat to let me 'break' the loop.*/ }
      matchers.inline.forEach(function(matcher){
        line = matcher(line);
      });
    }
    output += line + "\n";
  });
  return output;
}
