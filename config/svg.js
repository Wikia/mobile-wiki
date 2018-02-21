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
	'wds-icons-article',
	'wds-icons-menu-control',
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
