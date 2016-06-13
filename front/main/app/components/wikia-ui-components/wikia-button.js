/**
 * Wikia-button reusable component usage:
 *
 * @example
 * {{wikia-ui-components/wikia-button
 *      onButtonClick='clickHandler'
 *      trackLabel='load-more'
 * }}
 */

import Ember from 'ember';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

const {Component} = Ember;

export default Component.extend(
	{
		classNames: ['wikia-button-wrapper'],
		trackLabel: '',
		actions: {
			/**
			 * Handles click event on button - calls proper action if passed
			 * and tracks this click.
			 *
			 * @returns {void}
			 */
			onButtonClick() {
				const onButtonClick = this.get('onButtonClick');

				this.trackClick();

				if (onButtonClick) {
					onButtonClick(event);
				}
			}
		},

		trackClick() {
			mercuryTrack({
				action: trackActions.click,
				category: 'wikia-button',
				label: this.get('trackLabel')
			});
		}
	}
);
