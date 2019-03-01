export default function mockSearchTracking() {
  window.searchTracking = {
    trackSearchImpression: () => {},
    trackSearchClicked: () => {},
    trackSuggestImpression: () => {},
    trackSuggestClicked: () => {},
  };
}
