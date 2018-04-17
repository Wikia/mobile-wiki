import Component from '@ember/component';
import {computed} from '@ember/object';
import {bool, equal} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import config from '../../config/environment';

export default Component.extend({
	buildUrl: service(),
	currentUser: service(),
	fastboot: service(),
	tracking: service(),
	simpleStore: service(),
	wikiVariables: service(),
	tagName: '',
	layoutName: 'components/fastboot-only/body-bottom',

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
		const simpleStore = this.get('simpleStore').getProperties(
			'trackingDimensions',
			'articleId',
			'namespace',
			'isMainPage'
		);
		const wikiVariables = this.get('wikiVariables').getProperties(
			'cacheBuster',
			'cdnRootUrl',
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
		}, simpleStore));
	}),

	asyncScriptsPath: computed(function () {
		const langPath = this.get('buildUrl.langPath'),
			path = '/load.php?modules=wikia.ext.instantGlobals,instantGlobalsOverride,abtesting,abtest&only=scripts';

		return langPath ? `${langPath}${path}` : path;
	}),

	inContextTranslationsEnabled: config.inContextTranslationsEnabled,
	noExternals: config.noExternals
});
