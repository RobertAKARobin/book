"use strict";

window.onload = function(){
  h.for_each(h.el("[data-cols]"), function(el){
    var settings  = h.try_json(el.getAttribute("data-cols"));
    var trs       = h.el("tr", el);
    h.for_each(settings, function(setting, key){
      var tds     = [];
      h.for_each(trs, function(tr){
        tds = tds.concat(h.collect(tr.children, setting.split(" ")));
      });
      h.for_each(tds, function(td){
        switch(key){
          case "code":
            td.setAttribute("data-code", true);
            break
        }
      });
    });
  });
  
  // h.for_each(h.el("td b"), function(el){
  //   if(!el.previousSibling && !el.nextSibling){
  //     el.classList.add("line");
  //   }
  // });
}
