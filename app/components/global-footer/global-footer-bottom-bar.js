import {inject as service} from '@ember/service';
import $ from 'jquery';
import Component from '@ember/component';
import config from '../../config/environment';

export default Component.extend({
	tagName: '',
	wikiVariables: service(),

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
