/**
 * wds-button reusable component usage:
 *
 * @example
 * {{wikia-ui-components/wds
 *      onClick=(action='clickHandler')
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

		/**
		 * Handles click event on button - calls proper action if passed
		 * and tracks this click.
		 *
		 * @param {Event} event
		 * @returns {void}
		 */
		click(event) {
			const onClick = this.get('onClick');

			this.trackClick();

			if (onClick) {
				onClick(event);
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
