class VisitSourceWrapper {
	public static sessionVisitSource: any = (typeof VisitSource === 'function') ?
		new VisitSource('WikiaSessionSource', pageParams.cookieDomain) :
		undefined;
	public static lifetimeVisitSource: any = (typeof VisitSource === 'function') ?
		new VisitSource('WikiaLifetimeSource', pageParams.cookieDomain, false) :
		undefined;

	public static init() {
		if (this.sessionVisitSource && this.lifetimeVisitSource) {
			this.sessionVisitSource.checkAndStore();
			this.lifetimeVisitSource.checkAndStore();
		}
	}
}
