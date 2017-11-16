import {equal, and} from '@ember/object/computed';
import Service, {inject as service} from '@ember/service';

export default Service.extend({
	currentUser: service(),
	wikiVariables: service(),

	smartBannerVisible: false,

	isUserLangEn: equal('currentUser.language', 'en'),
	shouldShowFandomAppSmartBanner: and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
	isFandomAppSmartBannerVisible: and('shouldShowFandomAppSmartBanner', 'smartBannerVisible'),

	setVisibility(state) {
		this.set('smartBannerVisible', state);
	}
});
