'use strict';

const designSystemAssetsPath = 'node_modules/design-system/dist/svg/';

// DS icons which should be returned in bottom of body
const designSystemInlineSVGs = [
  'wds-company-logo-fandom-white',
  'wds-company-logo-fandom-heart',
  'wds-company-logo-wikia-org',
  'wds-icons-avatar',
  'wds-icons-image',
  'wds-icons-magnifying-glass',
  'wds-icons-magnifying-glass-small',
  'wds-icons-menu',
  'wds-icons-menu-small',
  'wds-icons-comment-small',
  'wds-icons-dropdown-tiny',
  'wds-icons-flag-small',
].map(name => (
  { name, path: `${designSystemAssetsPath}${name}.svg` }
));

// DS icons which should be lazy loaded
const designSystemLazyLoadedSVGs = [
  'wds-icons-add',
  'wds-icons-alert',
  'wds-icons-alert-small',
  'wds-icons-arrow',
  'wds-icons-arrow-small',
  'wds-icons-arrow-tiny',
  'wds-icons-bell',
  'wds-icons-checkmark-small',
  'wds-icons-bookmark',
  'wds-icons-clock',
  'wds-icons-close',
  'wds-icons-close-small',
  'wds-icons-close-tiny',
  'wds-icons-download',
  'wds-icons-external-tiny',
  'wds-icons-facebook',
  'wds-icons-flag',
  'wds-icons-poll-tiny',
  'wds-icons-quiz-tiny',
  'wds-icons-grid',
  'wds-icons-heart-small',
  'wds-icons-instagram',
  'wds-icons-link',
  'wds-icons-linkedin',
  'wds-icons-menu-control',
  'wds-icons-menu-control-small',
  'wds-icons-menu-control-tiny',
  'wds-icons-page',
  'wds-icons-pages-small',
  'wds-icons-pencil-small',
  'wds-icons-pencil-tiny',
  'wds-icons-play',
  'wds-icons-comment',
  'wds-icons-comment-tiny',
  'wds-icons-twitter',
  'wds-icons-upvote',
  'wds-icons-upvote-small',
  'wds-icons-upvote-tiny',
  'wds-icons-user',
  'wds-icons-user-small',
  'wds-icons-youtube',
  'wds-player-icon-play',
  'wds-company-store-appstore',
  'wds-company-store-googleplay',
  'wds-company-store-logo-fandom',
  'wds-company-store-logo-ddb',
  'wds-icons-checkmark-small',
].map(name => (
  { name, path: `${designSystemAssetsPath}${name}.svg` }
));

const inlineSVGs = [...designSystemInlineSVGs];

const lazyloadedSVGs = [...designSystemLazyLoadedSVGs];

module.exports = {
  inlineSVGs,
  lazyloadedSVGs,
};
