"use strict";

var h = (function(){
  var out = {};
  out.forEach = function(input, callback){
    var i, l, isBrowser = (typeof NodeList === "undefined");
    if(typeof input == "number") input = new Array(input);
    else if(typeof input == "string") input = input.split("");
    if((input instanceof Array) || (isBrowser && input instanceof NodeList)){
      l = input.length;
      for(i = 0; i < l; i++) callback(input[i], i);
    }else for(i in input){ callback(input[i], i); }
  }
  return out;
})();

if(typeof module !== "undefined") module.exports = h;
