class VisitSourceWrapper {
	public static sessionVisitSource: any = (typeof VisitSource === 'function') ?
		new VisitSource('WikiaSessionSource', pageParams.cookieDomain) :
		undefined;
	public static lifetimeVisitSource: any = (typeof VisitSource === 'function') ?
		new VisitSource('WikiaLifetimeSource', pageParams.cookieDomain, false) :
		undefined;

	public static init() {
		if (VisitSourceWrapper.sessionVisitSource && VisitSourceWrapper.lifetimeVisitSource) {
			VisitSourceWrapper.sessionVisitSource.checkAndStore();
			VisitSourceWrapper.lifetimeVisitSource.checkAndStore();
		}
	}
}
