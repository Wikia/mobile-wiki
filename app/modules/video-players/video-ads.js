import JWPlayerTracker from '../ads/tracking/jwplayer-tracker';
import slotTracker from '../ads/tracking/slot-tracker';

const moatTrackingPartnerCode = 'wikiajwint101173217941';
const moatJwplayerPluginUrl = 'https://z.moatads.com/jwplayerplugin0938452/moatplugin.js';

/**
  * Calculate depth
  *
  * @param {number} depth
  * @returns {number}
  */
function calculateRV(depth) {
  const { context } = window.Wikia.adEngine;

  const capping = context.get('options.video.adsOnNextVideoFrequency');

  return (depth < 2 || !capping) ? 1 : (Math.floor((depth - 1) / capping) + 1);
}

/**
  * @param {number} depth
  * @returns {boolean}
  */
function shouldPlayAdOnNextVideo(depth) {
  const { context } = window.Wikia.adEngine;
  const capping = context.get('options.video.adsOnNextVideoFrequency');

  return context.get('options.video.playAdsOnNextVideo') && capping > 0 && (depth - 1) % capping === 0;
}

/**
  * @param {number} depth
  * @returns {boolean}
  */
function canAdBePlayed(depth) {
  const isReplay = depth > 1;

  return !isReplay || (isReplay && shouldPlayAdOnNextVideo(depth));
}

/**
  * @param {number} videoDepth
  * @returns {boolean}
  */
function shouldPlayPreroll(videoDepth) {
  return canAdBePlayed(videoDepth);
}

/**
  * @param {number} videoDepth
  * @returns {boolean}
  */
function shouldPlayMidroll(videoDepth) {
  const { context } = window.Wikia.adEngine;
  return context.get('options.video.isMidrollEnabled') && canAdBePlayed(videoDepth);
}

/**
  * @param {number} videoDepth
  * @returns {boolean}
  */
function shouldPlayPostroll(videoDepth) {
  const { context } = window.Wikia.adEngine;
  return context.get('options.video.isPostrollEnabled') && canAdBePlayed(videoDepth);
}

/**
  * @param {Object} slot
  * @param {string} position
  * @param {number} depth
  * @param {number} correlator
  * @param {Object} slotTargeting
  * @returns {string}
  */
function getVastUrl(slot, position, depth, correlator, slotTargeting) {
  const { buildVastUrl } = window.Wikia.adEngine;
  return buildVastUrl(16 / 9, slot.getSlotName(), {
    correlator,
    vpos: position,
    targeting: Object.assign({
      passback: 'jwplayer',
      rv: calculateRV(depth),
    }, slotTargeting),
  });
}

/**
  * Setup ad events for jw player
  *
  * @param {Object} player
  * @param {Object} options
  * @param {Object} slotTargeting
  * @returns {void}
  */
function init(player, options, slotTargeting) {
  const {
    AdSlot,
    btfBlockerService,
    context,
    slotService,
    vastDebugger,
    vastParser,
  } = window.Wikia.adEngine;

  const slotName = options.featured ? 'featured' : 'video';
  const slot = slotService.get(slotName) || new AdSlot({ id: slotName });
  const adProduct = slot.config.trackingKey;
  const videoElement = player && player.getContainer && player.getContainer();
  const videoContainer = videoElement && videoElement.parentNode;
  const tracker = new JWPlayerTracker({
    adProduct,
    slotName: slot.getSlotName(),
    withCtp: !player.getConfig().autostart,
    withAudio: !player.getConfig().mute,
  });
  const targeting = slotTargeting;

  let correlator;
  let depth = options.depth || 0;
  let prerollPositionReached = false;

  slot.element = videoContainer;

  if (!slotService.get(slotName)) {
    slotService.add(slot);
  }

  slot.setConfigProperty('audio', !player.getMute());
  slot.setConfigProperty('autoplay', player.getConfig().autostart);

  if (context.get('options.video.moatTracking.enabledForArticleVideos')) {
    player.on('adImpression', (event) => {
      if (window.moatjw) {
        const payload = {
          adImpressionEvent: event,
          partnerCode: moatTrackingPartnerCode,
          player,
        };
        if (context.get('options.video.moatTracking.rv_s1_enabled')) {
          const rv = calculateRV(depth);
          payload.ids = {
            zMoatRV: rv <= 10 ? rv.toString() : '10+',
            zMoatS1: context.get('targeting.s1'),
          };
        }
        window.moatjw.add(payload);
      }
    });
  }

  player.on('adBlock', () => {
    tracker.updateType(adProduct);
  });

  player.on('beforePlay', () => {
    const currentMedia = player.getPlaylistItem() || {};

    targeting.v1 = currentMedia.mediaid;
    tracker.updateVideoId(currentMedia.mediaid);

    if (prerollPositionReached) {
      return;
    }

    // tracker.updateType(adProduct);
    correlator = Math.round(Math.random() * 10000000000);
    depth += 1;
    slot.setConfigProperty('audio', !player.getMute());
    slot.setConfigProperty('videoDepth', depth);

    if (shouldPlayPreroll(depth)) {
      /**
    * Fill in slot handle
    * @returns {void}
    */
      const fillInSlot = () => {
        player.playAd(getVastUrl(slot, 'preroll', depth, correlator, targeting));
      };

      // tracker.updateType(`${adProduct}-preroll`);

      if (options.featured) {
        fillInSlot();
      } else {
        btfBlockerService.push(slot, fillInSlot);
      }
    }

    prerollPositionReached = true;
  });

  player.on('videoMidPoint', () => {
    if (shouldPlayMidroll(depth)) {
      tracker.updateType(`${adProduct}-midroll`);
      slot.setConfigProperty('audio', !player.getMute());
      player.playAd(getVastUrl(slot, 'midroll', depth, correlator, targeting));
    }
  });

  player.on('beforeComplete', () => {
    if (shouldPlayPostroll(depth)) {
      tracker.updateType(`${adProduct}-postroll`);
      slot.setConfigProperty('audio', !player.getMute());
      player.playAd(getVastUrl(slot, 'postroll', depth, correlator, targeting));
    }
  });

  player.on('complete', () => {
    prerollPositionReached = false;
  });

  player.on('adRequest', (event) => {
    const vastParams = vastParser.parse(event.tag, {
      imaAd: event.ima && event.ima.ad,
    });

    vastDebugger.setVastAttributesFromVastParams(videoContainer, 'success', vastParams);

    if (options.featured) {
      // featuredVideoDelay.markAsReady(vastParams.lineItemId);
    }

    slotTracker.onRenderEnded(
      slot,
      {
        timestamp: Date.now(),
        line_item_id: vastParams.lineItemId,
        creative_id: vastParams.creativeId,
        creative_size: vastParams.size,
        status: 'success',
        page_width: videoContainer.clientWidth,
        viewport_height: videoContainer.scrollTop,
      },
    );
  });

  player.on('adError', (event) => {
    vastDebugger.setVastAttributes(videoContainer, event.tag, 'error', event.ima && event.ima.ad);

    if (options.featured) {
      // featuredVideoDelay.markAsReady();
    }

    slotTracker.onRenderEnded(
      slot,
      {
        timestamp: Date.now(),
        status: 'error',
        page_width: videoContainer.clientWidth,
        viewport_height: videoContainer.scrollTop,
      },
    );
  });

  tracker.register(player);
}

const jwPlayerMOAT = {
  loadTrackingPlugin: () => window.M.loadScript(moatJwplayerPluginUrl, true),
};

export default {
  init,
  jwPlayerMOAT,
};
