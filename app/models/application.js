import {inject as service} from '@ember/service';
import EmberObject from '@ember/object';
import {all, hashSettled, resolve} from 'rsvp';
import {getOwner} from '@ember/application';
import getHostFromRequest from '../utils/host';
import getLanguageCodeFromRequest from '../utils/language';
import UserModel from './user';
import NavigationModel from './navigation';
import WikiVariablesModel from './wiki-variables';
import TrackingDimensionsModel from './tracking-dimensions';

export default EmberObject.extend({
	currentUser: service(),
	fastboot: service(),
	logger: service(),
	simpleStore: service(),

	fetch(title, uselangParam) {
		const currentUser = this.get('currentUser'),
			fastboot = this.get('fastboot'),
			shoebox = fastboot.get('shoebox');

		if (fastboot.get('isFastBoot')) {
			const protocol = fastboot.get('request.headers').get('fastly-ssl')
				? 'https'
				: fastboot.get('request.protocol').replace(':', '');
			const host = getHostFromRequest(fastboot.get('request')),
				langPath = getLanguageCodeFromRequest(fastboot.get('request')),
				accessToken = fastboot.get('request.cookies.access_token'),
				ownerInjection = getOwner(this).ownerInjection();

			return all([
				WikiVariablesModel.create(ownerInjection).fetch(protocol, host, accessToken, langPath),
				UserModel.create(ownerInjection).getUserId(accessToken, langPath)
			]).then(([wikiVariablesData, userId]) => {
				shoebox.put('userId', userId);

				return hashSettled({
					currentUser: currentUser.initializeUserData(userId, host, langPath),
					navigation: NavigationModel.create(ownerInjection).fetchAll(
						host,
						wikiVariablesData.id,
						uselangParam || wikiVariablesData.language.content,
						langPath
					),
					trackingDimensions: TrackingDimensionsModel.create(ownerInjection).fetch(
						!userId,
						host,
						title,
						langPath
					),
					wikiVariablesData
				}).then(({navigation, wikiVariablesData, trackingDimensions}) => {
					// We only want to fail application if we don't have the navigation data
					if (navigation.state === 'rejected') {
						throw navigation.reason;
					}

					const applicationData = {
						navigation: navigation.value,
						wikiVariables: wikiVariablesData.value
					};

					shoebox.put('applicationData', applicationData);

					if (trackingDimensions.state === 'fulfilled' && trackingDimensions.value.dimensions) {
						this.get('simpleStore').set('trackingDimensions', trackingDimensions.value.dimensions);
					}

					return applicationData;
				});
			});
		} else {
			currentUser.initializeUserData(shoebox.retrieve('userId'));

			return resolve(shoebox.retrieve('applicationData'));
		}
	}
});
