import PlayerTracker from './player-tracker';

const playerName = 'jwplayer';
const trackingEventsMap = {
  ready: 'ready',
  adBlock: 'blocked',
  adClick: 'clicked',
  adRequest: 'loaded',
  adError: 'error',
  adImpression: 'impression',
  adStarted: 'started',
  adViewableImpression: 'viewable_impression',
  adFirstQuartile: 'first_quartile',
  adMidPoint: 'midpoint',
  adThirdQuartile: 'third_quartile',
  adComplete: 'completed',
  adSkipped: 'skipped',
  videoStart: 'content_started',
  complete: 'content_completed',
};

/**
  * Ads tracker for JWPlayer
  */
export default class JWPlayerTracker {
  /**
  * @param {Object} params
  */
  constructor(params = {}) {
    /** @type {Object} */
    this.trackingParams = params;
    /** @type {boolean} */
    this.isCtpAudioUpdateEnabled = true;
  }


  /**
   * Update withCtp and withAudio based on player and slot
   *
   * @param {Object} player
   * @param {AdSlot | null} slot
   */
  updateCtpAudio(player, slot) {
    if (slot && slot.getTargeting()) {
      const targeting = slot.getTargeting();
      this.trackingParams.withCtp = targeting.ctp === 'yes';
      this.trackingParams.withAudio = targeting.audio === 'yes';
      this.isCtpAudioUpdateEnabled = false;
    } else {
      this.trackingParams.withAudio = !player.getMute();
      this.trackingParams.withCtp = !player.getConfig().autostart;
    }
  }

  /**
  * Register event listeners on player
  * @param {Object} player
  * @returns {void}
  */
  register(player) {
    // Global imports:
    if (!window.Wikia.adEngine) {
      return;
    }

    const { slotService, vastParser } = window.Wikia.adEngine;
    // End of imports

    this.track('init');

    player.on('adComplete', () => {
      this.updateCreativeData();
    });

    player.on('adError', () => {
      this.updateCreativeData();
    });

    player.on('adRequest', (event) => {
      const currentAd = vastParser.getAdInfo(event.ima && event.ima.ad);

      this.updateCreativeData(currentAd);
    });

    this.trackingParams.withCtp = !player.getConfig().autostart;
    this.trackingParams.withAudio = !player.getConfig().mute;

    Object.keys(trackingEventsMap).forEach((playerEvent) => {
      player.on(playerEvent, (event) => {
        let errorCode;

        if ([
          'adRequest', 'adError', 'ready', 'videoStart',
        ].indexOf(playerEvent) !== -1 && this.isCtpAudioUpdateEnabled) {
          const slot = slotService.get(this.trackingParams.slotName);
          this.updateCtpAudio(player, slot);
        }

        if (playerEvent === 'adError') {
          errorCode = event && event.code;
        }

        this.track(trackingEventsMap[playerEvent], errorCode);


        // Disable updating ctp and audio on video completed event
        // It is a failsafe for the case where updating
        // has not been disabled by calling updateCtpAudio with VAST params
        if (playerEvent === 'complete') {
          this.isCtpAudioUpdateEnabled = false;
          this.trackingParams.withCtp = false;
        }
      });
    });
  }

  /**
  * Track single event
  * @param {string} eventName
  * @param {int} errorCode
  * @returns {void}
  */
  track(eventName, errorCode = 0) {
    PlayerTracker.track(this.trackingParams, playerName, eventName, errorCode);
  }

  /**
  * Update type of tracking data
  * @param {string} type
  * @returns {void}
  */
  updateType(type) {
    this.trackingParams.adProduct = type;
  }

  /**
  * Update video id
  * @param {string} videoId
  * @returns {void}
  */
  updateVideoId(videoId) {
    this.trackingParams.videoId = videoId;
  }

  /**
  * Update creative details
  * @param {Object} params
  * @returns {void}
  */
  updateCreativeData(params = {}) {
    this.trackingParams.lineItemId = params.lineItemId;
    this.trackingParams.creativeId = params.creativeId;
    this.trackingParams.contentType = params.contentType;
  }
}
