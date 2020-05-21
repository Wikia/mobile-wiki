import { Promise } from 'rsvp';

export const assetUrls = {
  styles: '/mobile-wiki/br/assets/jwplayer/index.css',
  script: '/mobile-wiki/br/assets/jwplayer/wikiajwplayer.js',
};

/**
  * @class JWPlayerAssets
  */
class JWPlayerAssets {
  constructor() {
    this.wasStyleLoadInitialized = false;
    this.scriptsPromise = null;
  }

  loadStyles() {
    if (!this.wasStyleLoadInitialized) {
      const styles = document.createElement('link');

      styles.rel = 'stylesheet';
      styles.href = assetUrls.styles;
      document.head.appendChild(styles);

      this.wasStyleLoadInitialized = true;
    }
  }

  loadScripts() {
    if (!this.scriptsPromise) {
      this.scriptsPromise = new Promise((resolve, reject) => {
        window.M.loadScript(assetUrls.script, true, (data) => {
          if (typeof window.wikiaJWPlayer === 'function') {
            resolve(data);
          } else {
            /*
             Some ISP wrap ajax request with their own script loaders
             that introduces a race condition that is hard to win
             this issue will be resolved when we switch fully to HTTPS
            */
            reject();
          }
        });
      });
    }

    return this.scriptsPromise;
  }

  load() {
    this.loadStyles();

    return this.loadScripts();
  }
}

export default new JWPlayerAssets();
