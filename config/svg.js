const designSystemAssetsPath = 'node_modules/design-system/style-guide/assets/';

// DS icons which should be returned in bottom of body
const designSystemInlineSVGs = [
	'wds-company-logo-fandom',
	'wds-icons-menu',
	'wds-icons-magnifying-glass',
	'wds-icons-image',
].map(name => {
	return {name, path: `${designSystemAssetsPath}${name}.svg`};
});

// DS icons which should be lazy loaded
const designSystemLazyLoadedSVGs = [
	'wds-icons-arrow',
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
	'wds-icons-menu-control-tiny',
	'wds-icons-out-arrow-tiny',
	'wds-icons-pencil',
	'wds-icons-pencil-small',
	'wds-icons-play',
	'wds-icons-reply',
	'wds-icons-reply-small',
	'wds-icons-twitter',
	'wds-icons-upvote',
	'wds-icons-upvote-small',
	'wds-icons-user',
	'wds-icons-youtube',
	'wds-avatar-icon'
].map(name => {
	return {name, path: `${designSystemAssetsPath}${name}.svg`};
});

const inlineSVGs = [...designSystemInlineSVGs];

const lazyloadedSVGs = [...designSystemLazyLoadedSVGs];

module.exports = {
	inlineSVGs,
	lazyloadedSVGs
};
