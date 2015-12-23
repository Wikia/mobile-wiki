import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import {track, trackActions} from '../../mercury/utils/track';

export default Ember.Component.extend(
	TrackClickMixin,
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
						label: this.get('isCollapsed') ? 'close' : 'open'
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
