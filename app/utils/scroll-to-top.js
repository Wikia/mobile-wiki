import offset from '@wikia/ember-fandom/utils/offset';

/**
  * Utility to scroll page in such way that provided element is at the top of the screen
  */
export default function (element, behavior = 'smooth') {
  const siteHeadContainer = document.querySelector('.site-head-container');
  const navHeight = siteHeadContainer ? siteHeadContainer.offsetHeight : 0;
  const scrollTop = parseInt(offset(element).top - navHeight, 10);

  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: scrollTop,
      behavior,
    });
  } else {
    window.scrollTo(0, scrollTop);
  }
}
