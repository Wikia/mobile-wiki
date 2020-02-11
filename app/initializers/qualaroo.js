import createSVG from '../utils/create-svg';

export default {
  name: 'qualaroo',
  initialize() {
    if (typeof FastBoot === 'undefined') {
      window._kiq = [];
      if (!window.M.getFromHeadDataStore('wikiVariables.isTestWiki')) {
        console.log('trackingQuquq', M.trackingQueue);

      }
    }
  },
};
