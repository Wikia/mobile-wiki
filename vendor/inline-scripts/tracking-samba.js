(function() {
  var vertical = M.getFromHeadDataStore('tracking.vertical');

  if (vertical.toLowerCase() === 'tv') {
    M.trackingQueue.push(function(optIn) {
      if (optIn) {
        var t = window.SambaTV = window.SambaTV || [];
        if (!t.track) {
          if (t.invoked) {
            return void(window.console && window.console.error && window.console.error("Samba Metrics snippet included twice."));
          }
          t.invoked = !0, t.methods = ["track", "Impression", "Purchase", "Register", "Click", "Login", "Register"], t.factory = function (e) {
            return function () {
              var r = Array.prototype.slice.call(arguments);
              return r.unshift(e), t.push(r), t
            }
          };
          for (var e = 0; e < t.methods.length; e++) {
            var r = t.methods[e];
            t[r] = t.factory(r)
          }
          t.load = function (t) {
            var e = document.createElement("script");
            e.type = "text/javascript", e.async = !0, e.src = ("https:" === document.location.protocol ? "https://" : "http://") + "tag.mtrcs.samba.tv/v3/tag/" + t + "/sambaTag.js";
            document.head.appendChild(e);
          }, t.attrs || (t.attrs = {}), t.SNIPPET_VERSION = "1.0.1", t.load("wikia/fandom-homepage")
        }
      }
    })
  }
}());
