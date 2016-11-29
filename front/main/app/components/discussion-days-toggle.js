import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	{
		classNames: ['discussion-days-toggle'],

		isDropdownActive: false,

		days: 30,

		actions: {
			toggleDropdown() {
				this.set('isDropdownActive', !this.get('isDropdownActive'));
			},

			setDays(days) {
				this.set('days', days);
				this.sendAction('setDays', days);
				this.send('toggleDropdown');
			}
		}
	}
);
