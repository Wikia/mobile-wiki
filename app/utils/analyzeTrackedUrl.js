import logEvent from '../modules/event-logger';

export default function analyzeTrackedUrl(params) {
	if (!window.ga || typeof window.ga.getAll !== 'function') {
		return;
	}

	const tracker = window.ga.getAll()[0];

	if (!tracker) {
		return;
	}

	const page = tracker.get('page');

	if (window.location.href.indexOf(page) === -1) {
		logEvent('GA url does not match window.location', params);
	}
}
