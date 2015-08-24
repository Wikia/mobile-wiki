class AuthTracker {
	gaCategory: string;

	constructor (gaCategory: string) {
		this.gaCategory = gaCategory;
	}

	public trackClick (element: HTMLElement, label: string, action = Mercury.Utils.trackActions.click): void {
		if (!element) {
			return;
		}

		element.addEventListener('click', function (): void {
			this.track(label, action);
		}.bind(this))
	}

	public trackPageView (pageType: string) {
		M.trackPageView({
			a: null,
			n: null
		});
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
		M.track({
			trackingMethod: 'both',
			action: action,
			category: this.gaCategory,
			label: label
		});
	}
}
