/**
 * baseline.js
 * @description Sets up baseline first load experience to mirror the main web client
 */

function resetMercuryBaseline() {
	var M = window.M;

	M.prop('apiBase', '/api/mercury', true);
	M.provide('wiki', {
		language: {
			content: 'en'
		}
	});
}

resetMercuryBaseline();
