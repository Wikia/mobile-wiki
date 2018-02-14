import Component from '@ember/component';
import {computed} from '@ember/object';
import {bool, equal} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import config from '../../config/environment';

export default Component.extend({
	currentUser: service(),
	fastboot: service(),
	tracking: service(),
	headStore: service(),
	wikiVariables: service(),
	tagName: '',
	layoutName: 'components/fastboot-only/body-bottom',
	noExternals: bool('queryParams.noexternals'),
	isRtl: equal('wikiVariables.language.contentDir', 'rtl'),

	data: computed(function () {
		const cookieDomain = config.cookieDomain;
		const currentUser = this.get('currentUser');
		// We have to anonymize user id before sending it to Google
		// It's faster to do the hashing server side and pass to the front-end, ready to use
		const gaUserIdHash = currentUser.getGaUserIdHash();
		const noExternals = config.noExternals;
		const tracking = this.get('tracking.config');
		const isAuthenticated = currentUser.get('isAuthenticated');
		const wikiaEnv = config.wikiaEnv;
		const headStore = this.get('headStore').getProperties(
			'trackingDimensions',
			'articleId',
			'namespace',
			'isMainPage'
		);
		const wikiVariables = this.get('wikiVariables').getProperties(
			'dbName',
			'id',
			'language'
		);

		return JSON.stringify(Object.assign({
			cookieDomain,
			gaUserIdHash,
			noExternals,
			tracking,
			isAuthenticated,
			wikiaEnv,
			wikiVariables
		}, headStore));
	}),

	inContextTranslationsEnabled: config.inContextTranslationsEnabled,
});
