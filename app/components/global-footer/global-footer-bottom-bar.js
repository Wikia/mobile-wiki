import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
	tagName: '',
	wikiVariables: Ember.inject.service(),

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
