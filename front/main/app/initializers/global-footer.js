import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {$, getWithDefault} = Ember;

/**
 * @returns {void}
 */
export function initialize() {
	$('.wds-global-footer a').click(function (event) {
		const trackingLabel = this.getAttribute('data-tracking-label');

		if (trackingLabel) {
			track({
				action: trackActions.click,
				category: 'footer',
				label: trackingLabel
			});
		}

		if (this.getAttribute('id') === 'global-footer-full-site-link') {
			const cookieDomain = M.prop('cookieDomain'),
				defaultSkin = getWithDefault(Mercury, 'wiki.defaultSkin', 'oasis');

			event.preventDefault();

			$.cookie('useskin', defaultSkin, {
				domain: cookieDomain,
				path: '/'
			});

			window.location.assign(this.href);
		}
	});
}

export default {
	name: 'global-footer',
	initialize
};
