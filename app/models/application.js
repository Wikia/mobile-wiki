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
	get(fastboot, title) {
		if (fastboot.get('isFastBoot')) {
			const host = getHostFromRequest(fastboot.get('request')),
				accessToken = fastboot.get('request.cookies.access_token');

			return RSVP.all([
				WikiVariables.get(host),
				UserModel.getUserId(accessToken)
			]).then(([wikiVariables, userId]) => {
				return RSVP.all([
					NavigationModel.getAll(host, wikiVariables.id, wikiVariables.language.content),
					// initialize currentUser
					getAndPutTrackingDimensionsToShoebox(
						fastboot, !Boolean(userId), host, title
					)
				]).then(([navigationData]) => {
					console.log(wikiVariables);

					if (!wikiVariables.siteName) {
						wikiVariables.siteName = 'Fandom powered by Wikia';
					}

					wikiVariables.host = host;
					extend(wikiVariables, navigationData);

					fastboot.get('shoebox').put('wikiVariables', wikiVariables);

					return wikiVariables;
				});
			});
		} else {
			return RSVP.resolve(fastboot.get('shoebox').retrieve('wikiVariables'));
		}
	}
});

export default ApplicationModel
