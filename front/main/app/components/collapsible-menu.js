import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	{
		tagName: 'nav',
		classNames: ['collapsible-menu'],
		classNameBindings: ['additionalClasses'],
		additionalClasses: null,
		isCollapsed: true,
		observe: null,
		ordered: false,
		showMenuIcon: true,
		tLabel: '',
		trackingEvent: null,

		actions: {
			/**
			 * @returns {void}
			 */
			toggleMenu() {
				this.toggleProperty('isCollapsed');

				if (this.trackingEvent !== null) {
					track({
						action: trackActions.click,
						category: this.get('trackingEvent'),
						label: this.get('isCollapsed') ? 'collapsed' : 'expanded'
					});
				}
			}
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			Ember.addObserver(this, 'observe', this, this.titleDidChange);
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			Ember.removeObserver(this, 'observe', this, this.titleDidChange);
		},

		/**
		 * @returns {void}
		 */
		titleDidChange() {
			if (!this.get('isCollapsed')) {
				this.set('isCollapsed', true);
			}
		},
	}
);
