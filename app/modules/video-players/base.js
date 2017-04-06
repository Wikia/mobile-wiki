import {containerSize} from '../../utils/calculation';
import {track} from '../../utils/track';

export default class BasePlayer {
	/**
	 * @param {string} provider
	 * @param {*} params
	 * @returns {void}
	 */
	constructor(provider, params) {
		if (!provider) {
			throw new Error('VideoPlayer requires a provider as the first argument');
		}
		this.provider = provider;
		this.params = params;
		this.id = params.videoId;
		this.videoWidth = params.size.width;
		this.videoHeight = params.size.height;
		// Most common video container selector
		this.containerSelector = '.lightbox-content-inner > iframe';
	}

	/**
	 * @returns {void}
	 */
	setupPlayer() {
	}

	/**
	 * @returns {*}
	 */
	loadPlayer() {
		return $script(this.resourceURI, () => {
			// called once player is loaded
			this.playerDidLoad();
		});
	}

	/**
	 * Intentionally a no-op, documentation that this hook is implemented
	 * and to not error when called by loadPlayer*
	 *
	 * @returns {void}
	 */
	playerDidLoad() {
	}

	/**
	 * Sets CSS width and height for the video container.
	 * Container selector is can be overriden by the inheriting class
	 *
	 * @param {string} [containerSelector] - JQuery selector of the video container
	 * @returns {void}
	 */
	onResize(containerSelector = this.containerSelector) {
		const $container = $(containerSelector),
			$lightbox = $('.lightbox-wrapper'),
			lightboxWidth = $lightbox.width(),
			lightboxHeight = $lightbox.height(),
			targetSize = containerSize(
				lightboxWidth,
				lightboxHeight,
				this.videoWidth,
				this.videoHeight
			);

		let sanitizedSize;

		// sanitize as our backend sometimes returns size of 0x0
		if (targetSize.width > 0 && targetSize.height > 0) {
			sanitizedSize = {
				width: targetSize.width,
				height: targetSize.height
			};
		} else {
			sanitizedSize = {
				width: '100%',
				height: '100%'
			};
		}

		$container.css(sanitizedSize);
	}

	/**
	 * @param {string} id
	 * @returns {string}
	 */
	static createUniqueId(id) {
		const element = document.getElementById(id),
			newId = id + new Date().getTime();

		if (element) {
			element.id = newId;
		}

		return newId;
	}

	/**
	 * @param {string} action
	 * @param {string} event
	 * @returns {void}
	 */
	track(action, event) {
		return track({
			action,
			category: `video-player-${event}`,
			label: this.provider,
		});
	}
}
