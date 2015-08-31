declare var VisitSource: any;

class VisitSourceWrapper {
	public static sessionVisitSource: any = new VisitSource('WikiaSessionSource', pageParams.cookieDomain);
	public static lifetimeVisitSource: any = new VisitSource('WikiaLifetimeSource', pageParams.cookieDomain, false);

	public static init() {
		this.sessionVisitSource.checkAndStore();
		this.lifetimeVisitSource.checkAndStore();
	}
}
