import {logDebug} from '../modules/event-logger';

export default function analyzeTrackedUrl(params) {
	if (!window.ga || typeof window.ga.getAll !== 'function') {
		return;
	}

	const tracker = window.ga.getAll()[0];

	if (!tracker) {
		return;
	}

	const gaPage = tracker.get('page');
	const actualUrl = window.location.href;

	if (actualUrl.indexOf(gaPage) === -1) {
		logDebug('GA url does not match window.location', Object.assign({
			gaPage,
			actualUrl
		}, params));
	}
}
