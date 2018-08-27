import { inject as service } from '@ember/service';
import Component from '@ember/component';
import config from '../../config/environment';

export default Component.extend({
	wikiVariables: service(),

	tagName: '',

	actions: {
		fullSiteClicked() {
			this.track('full-site-link');
			window.Cookies.set('useskin', this.getWithDefault('wikiVariables.defaultSkin', 'oasis'), {
				domain: config.APP.cookieDomain,
				path: '/'
			});

			window.location.reload();
		}
	}
});
