import Component from '@ember/component';
import {equal} from '@ember/object/computed';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

import config from '../config/environment';

export default Component.extend({
	currentUser: service(),
	fastboot: service(),
	tracking: service(),
	headStore: service(),
	wikiVariables: service(),
	layoutName: 'components/fastboot-only/head-bottom',
	tagName: '',

	isRtl: equal('wikiVariables.language.contentDir', 'rtl'),

	data: computed(function () {
		const cookieDomain = config.cookieDomain;
		const currentUser = this.get('currentUser');
		// We have to anonymize user id before sending it to Google
		// It's faster to do the hashing server side and pass to the front-end, ready to use
		const gaUserIdHash = currentUser.getGaUserIdHash();
		const noExternals = config.noExternals;
		const tracking = this.get('tracking.config');
		const trackingDimensions = this.get('headStore.tracking');
		const namespace = this.get('headStore.namespace');
		const isMainPage = this.get('headStore.isMainPage');
		const articleId = this.get('headStore.articleId');
		const userId = currentUser.get('userId');
		const wikiaEnv = config.wikiaEnv;
		const wikiVariables = this.get('wikiVariables').getProperties(
			'dbName',
			'id',
			'language'
		);

		return JSON.stringify({
			cookieDomain,
			gaUserIdHash,
			noExternals,
			tracking,
			trackingDimensions,
			userId,
			wikiaEnv,
			wikiVariables,
			namespace,
			articleId,
			isMainPage
		});
	})
});
