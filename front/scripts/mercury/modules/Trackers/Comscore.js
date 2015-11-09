import {BaseTracker} from 'BaseTracker';
import {prop} from '../../../baseline/mercury/utils/state';

export class Comscore extends BaseTracker {
	/**
	 * @returns {void}
	 */
	constructor() {
		window._comscore = window._comscore || [];
		super();
	}

	/**
	 * @returns {string}
	 */
	url() {
		const prefix = (document.location.protocol === 'https:' ? 'https://sb' : 'http://b');

		return `${prefix}.scorecardresearch.com/beacon.js?${Math.random()}`;
	}

	/**
	 * @returns {void}
	 */
	trackPageView() {
		const comscore = prop('tracking.comscore'),
			id = comscore.id,
			c7Value = comscore.c7Value;

		window._comscore.push({
			c1: '2',
			c2: id,
			options: {
				url_append: `${comscore.keyword}=${c7Value}`
			}
		});

		this.appendScript();
	}
}
