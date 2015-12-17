/**
 * @returns {void}
 */
export function initialize() {
	if (typeof VisitSource === 'function') {
		(new VisitSource('WikiaSessionSource', M.prop('cookieDomain'))).checkAndStore();
		(new VisitSource('WikiaLifetimeSource', M.prop('cookieDomain'), false)).checkAndStore();
	}
}

export default {
	name: 'visit-source',
	initialize
};
