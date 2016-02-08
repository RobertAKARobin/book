var express = require("express");
var app = express();
var fs = require("fs");
var entities = new (require('html-entities').AllHtmlEntities)();

var h = require("./public/helpers.js");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.redirectTo("/index.html");
});

app.get("/index.html", function(req, res){
  fs.readFile("./public/index.html", "utf8", function(err, html){
    html = html.replace(/(###)((.|[\n\r])*)(###)/gm, function(match, p1, p2){
      return entities.encode(p2);
    });
    res.send(html);
  });
});

app.listen(4000, function(req, res){
  console.log("Listening on 4000.");
});
