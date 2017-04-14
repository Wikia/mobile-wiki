import Ember from 'ember';
import getHostFromRequest from '../utils/host';
import {getAndPutTrackingDimensionsToShoebox} from '../utils/tracking-dimensions';
import UserModel from './user';
import NavigationModel from './navigation';
import WikiVariables from './wiki-variables';
import applicationInstance from '../utils/application-instance';

const {
	Object: EmberObject,
	RSVP
} = Ember;

const ApplicationModel = EmberObject.extend({});

ApplicationModel.reopenClass({
	get(title) {
		const currentUser = applicationInstance.instance.lookup('service:current-user'),
			fastboot = applicationInstance.instance.lookup('service:fastboot'),
			shoebox = fastboot.get('shoebox');

		if (fastboot.get('isFastBoot')) {
			const host = getHostFromRequest(fastboot.get('request')),
				accessToken = fastboot.get('request.cookies.access_token');

			return RSVP.all([
				WikiVariables.get(host),
				UserModel.getUserId(accessToken)
			]).then(([wikiVariables, userId]) => {
				shoebox.put('userId', userId);

				return RSVP.hashSettled({
					currentUser: currentUser.initializeUserData(userId, host),
					navigation: NavigationModel.getAll(host, wikiVariables.id, wikiVariables.language.content),
					trackingDimensions: getAndPutTrackingDimensionsToShoebox(!Boolean(userId), host, title),
					wikiVariables
				}).then(({navigation, wikiVariables}) => {
					// We only want to fail application if we don't have the navigation data
					if (navigation.state === 'rejected') {
						throw navigation.reason;
					}

					const applicationData = {
						navigation: navigation.value,
						wikiVariables: wikiVariables.value
					};

					shoebox.put('applicationData', applicationData);

					return applicationData;
				});
			});
		} else {
			currentUser.initializeUserData(shoebox.retrieve('userId'));

			return RSVP.resolve(shoebox.retrieve('applicationData'));
		}
	}
});

export default ApplicationModel;
