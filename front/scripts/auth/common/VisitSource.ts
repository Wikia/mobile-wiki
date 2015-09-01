class VisitSourceWrapper {
	public static sessionVisitSource: any = (typeof VisitSource !== 'undefined') ?
		new VisitSource('WikiaSessionSource', pageParams.cookieDomain) :
		undefined;
	public static lifetimeVisitSource: any = (typeof VisitSource !== 'undefined') ?
		new VisitSource('WikiaLifetimeSource', pageParams.cookieDomain, false) :
		undefined;

	public static init() {
		if (this.sessionVisitSource && this.sessionVisitSource) {
			this.sessionVisitSource.checkAndStore();
			this.lifetimeVisitSource.checkAndStore();
		}
	}
}
