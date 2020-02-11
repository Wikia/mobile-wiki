import createSVG from '../utils/create-svg';

export default {
  name: 'qualaroo',
  initialize() {
    if (typeof FastBoot === 'undefined') {
      window._kiq = [];
      if (!window.M.getFromHeadDataStore('wikiVariables.isTestWiki')) {
        console.log('trackingQuquq', M.trackingQueue);
        M.trackingQueue.push((isOptedIn) => {
          console.log('qualarooUrl', window.M.getFromHeadDataStore('wikiVariables.qualarooUrl'));
          if (isOptedIn) {
            const renderedNudges = {};
            $script(window.M.getFromHeadDataStore('wikiVariables.qualarooUrl'));
            window._kiq.push(['eventHandler', 'nodeRendered', (nudgeId) => {
              if (renderedNudges[nudgeId]) {
                return;
              }

              renderedNudges[nudgeId] = true;
              const qualarooElement = document.getElementById('qual_ol');
              const stuffElement = qualarooElement.querySelector('.qual_ol_stuff');
              const closeElement = qualarooElement.querySelector('.qual_x_close');
              const fandomLogo = createSVG('wds-company-logo-fandom', 'fandom-logo');
              const close = createSVG('wds-icons-close-tiny', 'fandom-close-icon');
              closeElement.appendChild(close);
              stuffElement.insertBefore(fandomLogo, stuffElement.firstChild);
            }]);
          }
        });
      }
    }
  },
};
