import { slots } from '../slots';

function getNavbarHeight() {
  const navbar = document.querySelector('.site-head-wrapper');

  if (navbar) {
    return navbar.offsetHeight;
  }

  return 0;
}

function getUnstickThreshold() {
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth, 0);

  return (viewportWidth * 9 / 16 + getNavbarHeight()) * 2;
}

export const getConfig = () => ({
  autoPlayAllowed: true,
  defaultStateAllowed: true,
  fullscreenAllowed: true,
  stickinessAllowed: false,
  bfaaSlotName: 'top_leaderboard',
  unstickInstantlyBelowPosition: getUnstickThreshold(),
  topThreshold: getNavbarHeight(),
  onInit(adSlot, params) {
    slots.setupSlotVideoAdUnit(adSlot, params);
  },
});

export default {
  getConfig,
};
