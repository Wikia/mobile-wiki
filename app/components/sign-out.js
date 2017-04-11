import Ember from 'ember';
import {track, trackActions} from '../utils/track';

const {Component} = Ember;

export default Component.extend(
	{
		classNames: ['wds-sign-out'],
		title: null,
		trackingCategory: null,
		trackingLabel: null,

		actions: {
			trackClick() {
				track({
					action: trackActions.click,
					category: this.get('trackingCategory'),
					label: this.get('trackingLabel')
				});
			},
		}
	}
);
