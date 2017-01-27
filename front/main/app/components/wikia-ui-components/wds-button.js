/**
 * wds-button reusable component usage:
 *
 * @example
 * {{wikia-ui-components/wds-button
 *      onClick=(action 'clickHandler')
 *      trackLabel='load-more'
 * }}
 */

import Ember from 'ember';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

const {Component} = Ember;

export default Component.extend(
	{
		tagName: 'button',
		classNames: ['wds-button'],
		classNameBindings: ['isSecondary:wds-is-secondary', 'isText:wds-is-text'],
		isSecondary: false,
		isText: false,
		onClick: Ember.K,

		/**
		 * Handles click event on button - calls proper action if passed
		 * and tracks this click.
		 *
		 * @param {Event} event
		 * @returns {void}
		 */
		click(event) {
			this.trackClick();
			this.get('onClick')(event);
		},

		trackClick() {
			const trackLabel = this.get('trackLabel');

			if (trackLabel) {
				mercuryTrack({
					action: trackActions.click,
					category: 'wikia-button',
					label: trackLabel
				});
			}
		}
	}
);
