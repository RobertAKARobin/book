"use strict";

var fs        = require("fs");
var beaut     = require("js-beautify");
var sass      = require("node-sass");
var matchers  = require("./js/markymarkdown.js");

var title     = "Learn Some Code in About 2 Hours Without a Computer";

(function compileSASS(){
  write("css/style.css", sass.renderSync({
    file:         "css/style.scss",
    outputStyle:  "expanded",
    sourceMap:    false
  }).css.toString());
})();

(function compileHTML(){
  var book      = "";
  var layout    = {
    main: read("./layouts/main.html"),
    page: read("./layouts/page.html")
  }
  var viewVars  = {
    pageNum:      0,
    sectionName:  null,
    title:        null
  }

  require("./sections/_index").forEach(function(section){
    viewVars.sectionName = section;
    read("./sections/" + section + ".html").split(/\s*={5}\s*/).forEach(function(page){
      viewVars.pageNum += 1;
      if(viewVars.pageNum % 2 !== 0){
        // book += "<div class=\"sheet\">";
        viewVars.title = title;
      }else{
        viewVars.title = section;
      }
      page = markyMark(page);
      page = layout.page.replace("{{body}}", page);
      page = page.replace(/\{\{(.*?)}}/g, function(nil, varName){
        return viewVars[varName];
      });
      book += page;
      if(viewVars.pageNum % 2 === 0){
        // book += "</div>";
      }
    });
  });

  writePage("index.html", layout.main.replace("{{body}}", book));
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
    output += line + "\n";
  });
  return output;
}
