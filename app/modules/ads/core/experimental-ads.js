/* eslint-disable class-methods-use-this */
import { Promise } from 'rsvp';
import { communicationService } from "../communication/communication-service";

class ExperimentalAds {
  static getInstance() {
    return ExperimentalAds.instance;
  }

  static getLoadedInstance() {
    return Promise.resolve({});
  }

  constructor() {
    this.isBundleLoaded = false;
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
    jsScript.addEventListener('load', () => this.isBundleLoaded = true);

    cssLink.id = 'ae3.styles';
    cssLink.href = `${base}/styles.css`;
    cssLink.rel = 'stylesheet';

    document.head.appendChild(jsScript);
    document.head.appendChild(cssLink);

    communicationService.dispatch({
      type: '[MobileWiki] Init',
      payload: adsContext,
    });
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
    if (!this.isBundleLoaded) {
      return;
    }

    communicationService.dispatch({
      type: '[MobileWiki] Before transition',
    });
  }

  /**
   * initialized
   */
  onTransition() {
    if (!this.isBundleLoaded) {
      return;
    }

    communicationService.dispatch({
      type: '[MobileWiki] Transition',
    });
  }

  /**
   * initialized
   */
  afterTransition(adsContext) {
    if (!this.isBundleLoaded) {
      return;
    }

    communicationService.dispatch({
      type: '[MobileWiki] After transition',
      payload: adsContext,
    });
  }

  onMenuOpen() {
    communicationService.dispatch({
      type: '[MobileWiki] Menu open',
    });
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
