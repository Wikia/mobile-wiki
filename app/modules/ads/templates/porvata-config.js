import slots from '../slots';

function getNavbarHeight() {
  const navbar = document.querySelector('.site-head-wrapper');

  return navbar ? navbar.offsetHeight : 0;
}

export const getConfig = () => (
  {
    inViewportOffsetTop: getNavbarHeight(),
    isFloatingEnabled: false,
    onInit: (adSlot, params) => {
      slots.setupSlotVideoAdUnit(adSlot, params);
    },
  }
);

export default {
  getConfig,
};
