import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	{
		classNames: ['discussion-days-toggle'],

		isDropdownActive: false,

		days: null,

		closeDropdown() {
			this.set('isDropdownActive', false);
		},

		openDropdown() {
			//Needs to run later so that it does not intercept a currently bubbling click
			Ember.run.later(() => {
				this.$(window.document).one('click', this.closeDropdown.bind(this));
				this.set('isDropdownActive', true);
			});
		},

		actions: {
			openDropdown() {
				if (!this.get('isDropdownActive')) {
					this.openDropdown();
				}
			},

			setDays(days) {
				this.sendAction('setDays', days);
			}
		}
	}
);
