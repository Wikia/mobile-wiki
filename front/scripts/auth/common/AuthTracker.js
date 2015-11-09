/**
 * @class AuthTracker
 *
 * @property {string} gaCategory
 */
class AuthTracker {
	/**
	 * @param {string} gaCategory
	 * @param {string} pageType
	 * @returns {void}
	 */
	constructor(gaCategory, pageType) {
		this.gaCategory = gaCategory;
		M.setTrackContext({
			a: pageType,
			n: -1
		});
	}

	/**
	 * @param {HTMLElement} element
	 * @param {string} label
	 * @param {Object} [action=M.trackActions.click]
	 *
	 * @returns {void}
	 */
	trackClick(element, label, action) {
		if (!element) {
			return;
		}

		/**
		 * @returns {void}
		 */
		element.addEventListener('click', () => {
			this.track(label, action);
		});
	}

	/**
	 * @returns {void}
	 */
	trackPageView() {
		M.trackPageView(null);
	}

	/**
	 * @param {HTMLFormElement} form
	 * @param {string} label
	 *
	 * @returns {void}
	 */
	trackSubmit(form, label) {
		if (!form) {
			return;
		}

		/**
		 * @returns {void}
		 */
		form.addEventListener('submit', () => {
			this.track(label, M.trackActions.submit);
		});
	}

	/**
	 * @param {string} label
	 * @param {string} action
	 *
	 * @returns {void}
	 */
	track(label, action) {
		const trackOptions = {
				trackingMethod: 'both',
				category: this.gaCategory,
				action,
				label
			},
			sourceUrl = M.getQueryParam('redirect');

		if (sourceUrl) {
			trackOptions.sourceUrl = sourceUrl;
		}

		M.track(trackOptions);
	}
}
