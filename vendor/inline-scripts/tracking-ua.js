(function (M) {
 M.trackingQueue.push(function (isOptedIn) {
  if (M.getFromHeadDataStore('noExternals')) {
   return;
  }

  var dimensions = M.getFromHeadDataStore('trackingDimensions');

  if (dimensions) {
   var ua = M.tracker.UniversalAnalytics;

   window.onABTestLoaded(function () {
    if (ua.initialize(dimensions, !isOptedIn)) {
     ua.trackPageView({
      3: dimensions[3],
      14: dimensions[14],
      19: dimensions[19],
      25: dimensions[25]
     });
    }
   });
  }
 });
})(window.M);
