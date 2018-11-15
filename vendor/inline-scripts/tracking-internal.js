(function (M) {
  if (M.getFromHeadDataStore('noExternals')) {
    return;
  }

  var trackingDataShoebox = document.querySelector('#shoebox-trackingData');

  if (trackingDataShoebox) {
    var trackingData = JSON.parse(trackingDataShoebox.innerHTML);

    M.trackingQueue.push(function (isOptedIn) {
      M.tracker.Internal.trackPageView({
        a: trackingData.articleId,
        n: trackingData.namespace,
      }, isOptedIn);
    });
  }
}(window.M));
