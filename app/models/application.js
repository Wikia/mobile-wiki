import Ember from 'ember';
import getHostFromRequest from '../utils/host';
import {getAndPutTrackingDimensionsToShoebox} from '../utils/tracking-dimensions';
import UserModel from './user';
import NavigationModel from './navigation';
import WikiVariables from './wiki-variables';
import extend from '../utils/extend';

const {
	Object: EmberObject,
	RSVP
} = Ember;

const ApplicationModel = EmberObject.extend({});


ApplicationModel.reopenClass({
	get(fastboot, title, currentUser) {
		const shoebox = fastboot.get('shoebox');

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
					currentUser.initializeUserData(userId, host),
					getAndPutTrackingDimensionsToShoebox(
						fastboot, !Boolean(userId), host, title
					)
				]).then(([navigation]) => {
					if (!wikiVariables.siteName) {
						wikiVariables.siteName = 'Fandom powered by Wikia';
					}

					wikiVariables.host = host;

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
