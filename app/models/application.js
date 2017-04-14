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
		const fastboot = applicationInstance.instance.lookup('service:fastboot'),
			shoebox = fastboot.get('shoebox'),
			currentUser = applicationInstance.instance.lookup('service:current-user');

		if (fastboot.get('isFastBoot')) {
			const host = getHostFromRequest(fastboot.get('request')),
				accessToken = fastboot.get('request.cookies.access_token');

			return RSVP.all([
				WikiVariables.get(host),
				UserModel.getUserId(accessToken)
			]).then(([wikiVariables, userId]) => {
				shoebox.put('userId', userId);

				return RSVP.all([
					NavigationModel.getAll(host, wikiVariables.id, wikiVariables.language.content),
					RSVP.resolve(wikiVariables),
					currentUser.initializeUserData(userId, host),
					getAndPutTrackingDimensionsToShoebox(fastboot, !Boolean(userId), host, title)
				]).then(([navigation, wikiVariables]) => {
					const applicationData = {
						wikiVariables,
						navigation
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
