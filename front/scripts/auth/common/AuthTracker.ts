class AuthTracker {
	gaCategory: string;

	constructor (page: string) {
		this.gaCategory = this.setGaCategory(page);
	}

	private setGaCategory (page: string): string {
		return 'user-' + page + '-' + pageParams.viewType + (pageParams.isModal ? '-modal' : '');
	}

	public trackClick (element: HTMLElement, label: string, action = M.trackActions.click): void {
		if (!element) {
			return;
		}

		element.addEventListener('click', function (): void {
			this.track(label, action);
		}.bind(this))
	}

	public trackPageView (pageType: string) {
		if (pageType) {
			this.track(pageType, M.trackActions.impression);
		}
	}

	public trackSubmit (form: HTMLFormElement, label: string): void {
		if (!form) {
			return;
		}

		form.addEventListener('submit', function (): void {
			this.track(label, M.trackActions.submit);
		}.bind(this));
	}

	public track (label: string, action: string) {
		var trackOptions: TrackingParams = {
				trackingMethod: 'both',
				action: action,
				category: this.gaCategory,
				label: label
			},
			sourceUrl = M.getQueryParam('redirect');

		if (sourceUrl) {
			trackOptions.sourceUrl = sourceUrl;
		}

		M.track(trackOptions);
	}
}
