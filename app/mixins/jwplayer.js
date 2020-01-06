import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  autoplayCookieName: 'featuredVideoAutoplay',
  captionsCookieName: 'featuredVideoCaptions',
  videoSeenInSessionCookieName: 'featuredVideoSeenInSession',
  playerCookieExpireDays: 14,
});
