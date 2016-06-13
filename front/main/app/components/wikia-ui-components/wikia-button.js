/**
 * Wikia-button reusable component usage:
 *
 * @example
 * {{wikia-ui-components/wikia-button
 *      onButtonClick=(action='clickHandler')
 *      trackLabel='load-more'
 * }}
 */

import Ember from 'ember';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

const {Component} = Ember;

export default Component.extend(
	{
		classNames: ['wikia-button-wrapper'],
		actions: {
			/**
			 * Handles click event on button - calls proper action if passed
			 * and tracks this click.
			 *
			 * @returns {void}
			 */
			onButtonClick(event) {
				const onButtonClick = this.get('onButtonClick');

				this.trackClick();

				if (onButtonClick) {
					onButtonClick(event);
				}
			}
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
