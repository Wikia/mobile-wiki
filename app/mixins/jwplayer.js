import Mixin from '@ember/object/mixin';

export default Mixin.create({
  autoplayCookieName: 'featuredVideoAutoplay',
  captionsCookieName: 'featuredVideoCaptions',
  videoSeenInSessionCookieName: 'featuredVideoSeenInSession',
  playerCookieExpireDays: 14,
});
