import localSettings from '../../../config/localSettings';
import deepExtend from 'deep-extend';
import {gaUserIdHash} from '../../lib/Hashing';

export function isRtl(wikiVariables) {
	if (wikiVariables.language) {
		return wikiVariables.language.contentDir === 'rtl';
	}

	return false;
}

export function getUserId(request) {
	return request.auth.isAuthenticated ? request.auth.credentials.userId : 0;
}

export function getQualarooScriptUrl(request) {
	// all the third party scripts we don't want to load on noexternals
	if (!request.query.noexternals) {
		// qualaroo
		if (localSettings.qualaroo.enabled) {
			return localSettings.qualaroo.scriptUrl;
		}
	}

	return false;
}

export function getOpenGraphData(type, title, url, pageData) {
	const openGraphData = {
		type,
		title,
		url,
	};

	if (pageData && pageData.details) {
		if (pageData.details.abstract) {
			openGraphData.description = pageData.details.abstract;
		}

		if (pageData.details.thumbnail) {
			openGraphData.image = pageData.details.thumbnail;
		}
	}

	return openGraphData;
}

export function getLocalSettings() {
	return deepExtend({}, localSettings);
}
