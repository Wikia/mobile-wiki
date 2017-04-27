import Ember from 'ember';
import getHostFromRequest from '../utils/host';
import UserModel from './user';
import NavigationModel from './navigation';
import WikiVariables from './wiki-variables';
import TrackingDimensions from './tracking-dimensions';

const {
	Object: EmberObject,
	RSVP,
	getOwner,
	inject
} = Ember;

export default EmberObject.extend({
	currentUser: inject.service(),
	fastboot: inject.service(),

	fetch(title) {
		const currentUser = this.get('currentUser'),
			fastboot = this.get('fastboot'),
			shoebox = fastboot.get('shoebox');

		if (fastboot.get('isFastBoot')) {
			const host = getHostFromRequest(fastboot.get('request')),
				accessToken = fastboot.get('request.cookies.access_token'),
				ownerInjection = getOwner(this).ownerInjection();

			return RSVP.all([
				WikiVariables.create(ownerInjection).fetch(host),
				UserModel.create(ownerInjection).getUserId(accessToken)
			]).then(([wikiVariables, userId]) => {
				shoebox.put('userId', userId);

				return RSVP.hashSettled({
					currentUser: currentUser.initializeUserData(userId, host),
					navigation: NavigationModel.create(ownerInjection).fetchAll(
						host,
						wikiVariables.id,
						wikiVariables.language.content
					),
					trackingDimensions: TrackingDimensions.create(ownerInjection).fetch(
						!Boolean(userId),
						host, title,
						fastboot
					),
					wikiVariables
				}).then(({navigation, wikiVariables, trackingDimensions}) => {
					// We only want to fail application if we don't have the navigation data
					if (navigation.state === 'rejected') {
						throw navigation.reason;
					}

					const applicationData = {
						navigation: navigation.value,
						wikiVariables: wikiVariables.value
					};

					shoebox.put('applicationData', applicationData);

					if (trackingDimensions) {
						shoebox.put('trackingDimensionsForFirstPage', trackingDimensions);
					}

					return applicationData;
				});
			});
		} else {
			currentUser.initializeUserData(shoebox.retrieve('userId'));

			return RSVP.resolve(shoebox.retrieve('applicationData'));
		}
	}
});
