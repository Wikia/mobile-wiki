import Ember from 'ember';
import config from '../../config/environment';

const {$, Component, inject} = Ember;

export default Component.extend({
	tagName: '',
	wikiVariables: inject.service(),

	actions: {
		fullSiteClicked() {
			this.get('track')('full-site-link');
			$.cookie('useskin', this.getWithDefault('wikiVariables.defaultSkin', 'oasis'), {
				domain: config.cookieDomain,
				path: '/'
			});
		}
	}
});
