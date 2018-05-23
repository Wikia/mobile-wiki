import Service from '@ember/service';
import {getOwner} from '@ember/application';

export default Service.extend({
	hasUserTrackingConsent: false,

	setUserTackingConsent(bool) {
		this.set('hasUserTrackingConsent', bool);
	}
});
