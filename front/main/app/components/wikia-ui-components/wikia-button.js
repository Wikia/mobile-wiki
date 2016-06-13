import Ember from 'ember';
import {track as mercuryTrack, trackActions} from 'common/utils/track';

const {Component} = Ember;

export default Component.extend(
	{
		classNames: ['wikia-button-wrapper'],
		actions: {
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
