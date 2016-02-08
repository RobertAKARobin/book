var express = require("express");
var app = express();
var fs = require("fs");
var entities = new (require('html-entities').AllHtmlEntities)();

var h = require("./public/helpers.js");
var rx = {
  code: /<#((.|[\n\r])*?)#>/g,
  blank: /<\?((.|[\n\r])*?)\?>/g
}

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.redirectTo("/index.html");
});

app.get("/index.html", function(req, res){
  fs.readFile("./public/index.html", "utf8", function(err, html){
    html = html.replace(rx.code, function(match, p1){
      return entities.encode(p1);
    }).replace(rx.blank, function(match, p1){
      return "<span class='blank'>" + entities.encode(p1) + "</span>";
    });
    res.send(html);
  });
});

app.listen(4000, function(req, res){
  console.log("Listening on 4000.");
});
