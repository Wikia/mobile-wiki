export default function mockSearchTracking() {
  window.searchTracking = {
    trackSearchImpression: () => {},
    trackSearchClicked: () => {},
    trackSuggestImpression: () => {},
    trackSuggestClicked: () => {},
  };

  window.pageviewTime = {
    setupPageTime: () => {},
    initPageview: () => {},
    finishPageview: () => {},
  };
}
