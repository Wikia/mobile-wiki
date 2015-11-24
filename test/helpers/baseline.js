/**
 * baseline.js
 * @description Sets up baseline first load experience to mirror the main web client
 */

function resetMercuryBaseline () {
	var M = window.M;

	M.prop('apiBase', '/api/mercury', true);
	M.prop('weppyConfig', {
		host: '',
		samplingRate: 1,
		aggregationInterval: 1000
	}, true);
	M.provide('ads.slots', []);
	M.provide('wiki', {
		siteName: 'Test Site',
		language: {
			content: 'en'
		}
	});

	var dimensions = [];
	dimensions[8] = 'test/article';
	//FIXME this should be mocked in tests and not done here
	require('mercury/modules/Trackers/UniversalAnalytics').default.setDimensions(dimensions);
}

resetMercuryBaseline();
