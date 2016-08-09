import Ember from 'ember';

const {$, getWithDefault} = Ember;

/**
 * @returns {void}
 */
export function initialize() {
	$('#global-footer-full-site-link').click((event) => {
		const domainNameRegExpMatchArray = (/\.[a-z0-9\-]+\.[a-z0-9]{2,}$/i).exec(window.location.hostname),
			cookieDomain = domainNameRegExpMatchArray ? domainNameRegExpMatchArray[0] : '',
			defaultSkin = getWithDefault(Mercury, 'wiki.defaultSkin', 'oasis');

		event.preventDefault();

		$.cookie('useskin', defaultSkin, {
			domain: cookieDomain,
			path: '/'
		});

		window.location.assign(event.target.href);
	});
}

export default {
	name: 'global-footer-full-site-link',
	initialize
};
