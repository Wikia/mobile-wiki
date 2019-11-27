import createSVG from '../utils/create-svg';

export default {
  name: 'qualaroo',
  initialize() {
    if (typeof FastBoot === 'undefined') {
      window._kiq = [];
      window.getInstantGlobal('wgMobileQualaroo', (wgMobileQualaroo) => {
        if (wgMobileQualaroo && !window.M.getFromHeadDataStore('wikiVariables.isTestWiki')) {
          M.trackingQueue.push((isOptedIn) => {
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
      });
    }
  },
};
