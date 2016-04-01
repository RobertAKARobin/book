"use strict";

var express = require("express");
var app = express();
var fs = require("fs");
var entities = new (require('html-entities').AllHtmlEntities)();
var h = require("helpers-js");


var rx = (function(){
  var replacers = {};
  var patterns = [
    ["code", "#", "", ""],
    ["blank", "?", '<span class="blank">', '</span>'],
    ["mark", "*", "<mark>", "</mark>"]
  ]
  patterns.forEach(function(pattern){
    var mark = pattern[1];
    var regex = new RegExp("<\\" + mark + "((.|[\\n\\r])+?)\\" + mark + ">", "mg");
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
  return replacers;
}());
fs.readFile("./node_modules/helpers-js/helpers.js", "utf8", function(a, data){
  fs.writeFile("./public/helpers.js", data);
});

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.redirect("/index.html");
});

app.get("/index.html", function(req, res){
  fs.readFile("./public/index.html", "utf8", function(err, html){
    res.send(rx.replaceAll(html));
  });
});

app.listen(4000, function(req, res){
  console.log("Listening on 4000.");
});
