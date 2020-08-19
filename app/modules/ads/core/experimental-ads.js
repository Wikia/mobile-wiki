/* eslint-disable class-methods-use-this */
import { Promise } from 'rsvp';

class ExperimentalAds {
  static getInstance() {
    return ExperimentalAds.instance;
  }

  static getLoadedInstance() {
    return Promise.reject(new Error('ExperimentalAds bundle'));
  }

  constructor() {
    this.isInitializationStarted = false;
  }

  init(adsContext) {
    if (this.isInitializationStarted) {
      return;
    }

    this.isInitializationStarted = true;

    const jsScript = document.createElement('script');
    const cssLink = document.createElement('link');
    const base = `https://static.wikia.nocookie.net/fandom-ae-assets/platforms/${adsContext.opts.adEngineVersion}/ucp-mercury`;

    jsScript.id = 'ae3.bundle';
    jsScript.src = `${base}/main.bundle.js`;
    jsScript.async = true;
    jsScript.type = 'text/javascript';

    cssLink.id = 'ae3.styles';
    cssLink.href = `${base}/styles.css`;
    cssLink.rel = 'stylesheet';

    document.head.appendChild(jsScript);
    document.head.appendChild(cssLink);
  }

  getAdSlotComponentAttributes() {
  }

  pushSlotToQueue() {
  }

  registerActions() {
  }

  /**
   * initialized
   */
  beforeTransition() {
  }

  /**
   * initialized
   */
  onTransition() {
  }

  /**
   * initialized
   */
  afterTransition() {
  }

  onMenuOpen() {
  }

  waitForVideoBidders() {
    return Promise.reject(new Error('ExperimentalAds bundle'));
  }

  waitForUapResponse() {
    return Promise.reject(new Error('ExperimentalAds bundle'));
  }
}

ExperimentalAds.instance = new ExperimentalAds();

export default ExperimentalAds;
