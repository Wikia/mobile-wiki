import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {$, getWithDefault} = Ember;

/**
 * @returns {void}
 */
export function initialize() {
	$('.wds-global-footer a').click((event) => {
		const trackingLabel = event.currentTarget.getAttribute('data-tracking-label');

		if (trackingLabel) {
			track({
				action: trackActions.click,
				category: 'footer',
				label: trackingLabel
			});
		}

		if (event.target.getAttribute('id') === 'global-footer-full-site-link') {
			const domainNameRegExpMatchArray = (/\.[a-z0-9\-]+\.[a-z0-9]{2,}$/i).exec(window.location.hostname),
				cookieDomain = domainNameRegExpMatchArray ? domainNameRegExpMatchArray[0] : '',
				defaultSkin = getWithDefault(Mercury, 'wiki.defaultSkin', 'oasis');

			event.preventDefault();

			$.cookie('useskin', defaultSkin, {
				domain: cookieDomain,
				path: '/'
			});

			window.location.assign(event.target.href);
		}
	});
}

export default {
	name: 'global-footer',
	initialize
};
