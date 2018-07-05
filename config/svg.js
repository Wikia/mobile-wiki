const designSystemAssetsPath = 'node_modules/design-system/style-guide/assets/';

// DS icons which should be returned in bottom of body
const designSystemInlineSVGs = [
	'wds-avatar-icon-user',
	'wds-company-logo-fandom-white',
	'wds-icons-menu',
	'wds-icons-magnifying-glass',
	'wds-icons-magnifying-glass-small',
	'wds-icons-image',
	'wds-icons-menu-small',
	'wds-icons-reply-small',
	'wds-icons-dropdown-tiny'
].map((name) => {
	return { name, path: `${designSystemAssetsPath}${name}.svg` };
});

// DS icons which should be lazy loaded
const designSystemLazyLoadedSVGs = [
	'wds-avatar-icon',
	'wds-icons-arrow',
	'wds-icons-arrow-small',
	'wds-icons-arrow-tiny',
	'wds-icons-article',
	'wds-icons-circle-plus',
	'wds-icons-clock',
	'wds-icons-cross',
	'wds-icons-cross-tiny',
	'wds-icons-download',
	'wds-icons-facebook',
	'wds-icons-grid',
	'wds-icons-instagram',
	'wds-icons-linkedin',
	'wds-icons-megaphone',
	'wds-icons-menu-control',
	'wds-icons-menu-control-small',
	'wds-icons-menu-control-tiny',
	'wds-icons-out-arrow-tiny',
	'wds-icons-pages-small',
	'wds-icons-pencil',
	'wds-icons-pencil-small',
	'wds-icons-play',
	'wds-icons-reply',
	'wds-icons-reply-tiny',
	'wds-icons-twitter',
	'wds-icons-upvote',
	'wds-icons-upvote-small',
	'wds-icons-upvote-tiny',
	'wds-icons-user',
	'wds-icons-youtube',
	'wds-player-icon-play',
	'wds-company-store-appstore',
	'wds-company-store-googleplay',
	'wds-company-logo-fandom-powered-by-wikia-two-lines',
].map((name) => {
	return { name, path: `${designSystemAssetsPath}${name}.svg` };
});

const inlineSVGs = [...designSystemInlineSVGs];

const lazyloadedSVGs = [...designSystemLazyLoadedSVGs];

module.exports = {
	inlineSVGs,
	lazyloadedSVGs
};
