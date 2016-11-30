import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	{
		classNames: ['discussion-days-toggle'],

		days: null,

		actions: {
			toggleDropdown() {
				this.set('isDropdownActive', !this.get('isDropdownActive'));
			},

			setDays(days) {
				this.sendAction('setDays', days);
				this.send('toggleDropdown');
			}
		}
	}
);
