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
		liftigniter: inject.service(),
	}
);
