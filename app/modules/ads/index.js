/* eslint-disable class-methods-use-this */
import { Promise } from 'rsvp';
import { v4 as uuid } from 'ember-uuid';
import { adsSetup } from './setup';
import { fanTakeoverResolver } from './fan-takeover-resolver';
import { adblockDetector } from './tracking/adblock-detector';
import { pageTracker } from './tracking/page-tracker';
import { cheshireCat } from './ml/cheshire-cat';
import { tbViewability } from './ml/tb-viewability';
import { appEvents } from './events';
import { logError } from '../event-logger';
import { track, trackScrollY, trackXClick } from '../../utils/track';
import { isType } from './communication/is-type';
import { communicationService } from './communication/communication-service';
import OldAds from './module/old-ads';

class Ads {
  /**
   * Returns ads instance.
   *
   * @returns {Ads}
   * @public
   */
  static getInstance() {
    return OldAds.getInstance();
  }

  /**
   * Returns loaded ads instance.
   *
   * @returns {Promise|RSVP.Promise|*}
   */
  static getLoadedInstance() {
    return OldAds.getInstance().initialization.finished;
  }

  init(adsContext = {}, queryParams = {});

  getAdSlotComponentAttributes(slotName);

  pushSlotToQueue(name);

  registerActions({ onHeadOffsetChange, onSmartBannerChange });

  /**
   * initialized
   */
  beforeTransition();

  /**
   * initialized
   */
  onTransition(options);

  /**
   * initialized
   */
  afterTransition(mediaWikiAdsContext);

  onMenuOpen();

  waitForVideoBidders();

  waitForUapResponse(uapCallback, noUapCallback);
}

Ads.instance = null;

export default Ads;
