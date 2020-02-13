(function (M) {
  if (M.getFromHeadDataStore('noExternals')) {
    return;
  }

  var trackingDataShoebox = document.querySelector('#shoebox-trackingData');
  var wikiPageDataShoebox = document.getElementById('shoebox-wikiPage')

  if (trackingDataShoebox) {
    var shoeboxTrackingData = JSON.parse(trackingDataShoebox.innerHTML);
    var trackingData = {
      a: shoeboxTrackingData.articleId,
      n: shoeboxTrackingData.namespace,
    };

    if (wikiPageDataShoebox) {
      try {
        var wikiPageData = JSON.parse(wikiPageDataShoebox.innerHTML);

        if (wikiPageData && wikiPageData.data) {
          trackingData.rollout_tracking =  wikiPageData.data.isUcp ? 'ucp' : '';
        }
      } catch(e) {}
    }

    M.trackingQueue.push(function (isOptedIn) {
      M.tracker.Internal.trackPageView(trackingData, isOptedIn);
    });
  }
}(window.M));
