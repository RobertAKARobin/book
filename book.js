"use strict";

var express = require("express");
var app = express();
var fs = require("fs");
var h = require("helpers-js");

var rx = require("./components/replacer");

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
