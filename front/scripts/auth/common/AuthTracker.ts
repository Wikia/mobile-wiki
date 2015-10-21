/**
 * @class AuthTracker
 */
class AuthTracker {
	gaCategory: string;

	/**
	 * @constructs AuthTracker
	 *
	 * @param {string} gaCategory
	 * @param {string} pageType
	 */
	constructor (gaCategory: string, pageType: string) {
		this.gaCategory = gaCategory;
		M.setTrackContext({
			a: pageType,
			n: -1
		});
	}

	/**
	 * @param {HTMLElement} element
	 * @param {string} label
	 * @param {object} action
	 *
	 * @returns {undefined}
	 */
	public trackClick (element: HTMLElement, label: string, action = M.trackActions.click): void {
		if (!element) {
			return;
		}

		element.addEventListener('click', function (): void {
			this.track(label, action);
		}.bind(this))
	}

	/**
	 * @returns {undefined}
	 */
	public trackPageView () {
		M.trackPageView(null);
	}

	/**
	 * @param {HTMLFormElement} form
	 * @param {string} label
	 *
	 * @returns {undefined}
	 */
	public trackSubmit (form: HTMLFormElement, label: string): void {
		if (!form) {
			return;
		}

		form.addEventListener('submit', function (): void {
			this.track(label, M.trackActions.submit);
		}.bind(this));
	}

	/**
	 * @param {string} label
	 * @param {string} action
	 *
	 * @returns {undefined}
	 */
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
