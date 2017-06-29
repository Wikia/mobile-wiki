import Ember from 'ember';
import {getFetchErrorMessage, FandomPostsError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

const {
	Object: EmberObject,
	inject
} = Ember;

export default EmberObject.extend(
	{
		logger: inject.service(),
		wikiVariables: inject.service(),

		fetch(type) {
			const url = buildUrl({
				host: this.get('wikiVariables.host'),
				path: '/wikia.php',
				query: {
					controller: 'RecirculationApi1',
					method: 'getFandomPosts',
					type,
					cityId: this.get('wikiVariables.id'),
					format: 'json'
				}
			});

			return fetch(url)
				.then((response) => {
					if (response.ok) {
						return response.json();
					} else {
						return getFetchErrorMessage(response).then((responseBody) => {
							throw new FandomPostsError({
								code: response.status
							}).withAdditionalData({
								responseBody,
								requestUrl: url
							});
						});
					}
				})
				.catch((error) => this.get('logger').error('Fandom posts fetch error', error));
		}
	}
);
