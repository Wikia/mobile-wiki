import {addObserver, removeObserver} from '@ember/object/observers';
import Component from '@ember/component';
import {track, trackActions} from '../utils/track';

export default Component.extend(
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

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			addObserver(this, 'observe', this, this.titleDidChange);
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			removeObserver(this, 'observe', this, this.titleDidChange);
		},

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
		titleDidChange() {
			if (!this.get('isCollapsed')) {
				this.set('isCollapsed', true);
			}
		},
	}
);
