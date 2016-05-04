import {getQueryParam} from 'common/utils/querystring';
import {track as mercuryTrack, trackActions, trackPageView as mercuryTrackPageView, setTrackContext}
	from 'common/utils/track';

/**
 * @class AuthTracker
 *
 * @property {string} gaCategory
 */
export default class AuthTracker {
	/**
	 * @param {string} gaCategory
	 * @param {string} pageType
	 * @returns {void}
	 */
	constructor(gaCategory, pageType) {
		this.gaCategory = gaCategory;
		setTrackContext({
			a: pageType,
			n: -1
		});
	}

	/**
	 * @returns {void}
	 */
	trackCloseWindow() {
		if (!window.opener) {
			return;
		}

		window.addEventListener('beforeunload', () => {
			// to avoid tracking 'close' action whenever the window is reloaded;
			if (pageParams.parentOrigin) {
				window.opener.postMessage(
					{
						beforeunload: true,
						// we're expecting 0 or 1, but it comes from querystring - that's why parseInt
						forceLogin: Boolean(parseInt(pageParams.forceLogin, 10))
					},
					pageParams.parentOrigin
				);
			}
		});
	}

	/**
	 * @param {HTMLElement} element
	 * @param {string} label
	 * @param {Object} [action=trackActions.click]
	 *
	 * @returns {void}
	 */
	trackClick(element, label, action = trackActions.click) {
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
		mercuryTrackPageView();
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
			this.track(label, trackActions.submit);
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
			sourceUrl = getQueryParam('redirect');

		if (sourceUrl) {
			trackOptions.sourceUrl = sourceUrl;
		}

		mercuryTrack(trackOptions);
	}
}
