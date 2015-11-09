/**
 * @class VisitSourceWrapper
 */
class VisitSourceWrapper {
	/**
	 * @type {VisitSource}
	 */
	public static sessionVisitSource: any = (typeof VisitSource === 'function') ?
		new VisitSource('WikiaSessionSource', pageParams.cookieDomain) :
		undefined;
	/**
	 * @type {VisitSource}
	 */
	public static lifetimeVisitSource: any = (typeof VisitSource === 'function') ?
		new VisitSource('WikiaLifetimeSource', pageParams.cookieDomain, false) :
		undefined;

	/**
	 * @returns {void}
 	 */
	public static init() {
		if (VisitSourceWrapper.sessionVisitSource && VisitSourceWrapper.lifetimeVisitSource) {
			VisitSourceWrapper.sessionVisitSource.checkAndStore();
			VisitSourceWrapper.lifetimeVisitSource.checkAndStore();
		}
	}
}
