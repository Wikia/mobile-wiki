define('mobile-wiki/components/collapsible-menu', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
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
			toggleMenu: function toggleMenu() {
				this.toggleProperty('isCollapsed');

				if (this.trackingEvent !== null) {
					(0, _track.track)({
						action: _track.trackActions.click,
						category: this.get('trackingEvent'),
						label: this.get('isCollapsed') ? 'collapsed' : 'expanded'
					});
				}
			}
		},

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			Ember.addObserver(this, 'observe', this, this.titleDidChange);
		},


		/**
   * @returns {void}
   */
		willDestroyElement: function willDestroyElement() {
			Ember.removeObserver(this, 'observe', this, this.titleDidChange);
		},


		/**
   * @returns {void}
   */
		titleDidChange: function titleDidChange() {
			if (!this.get('isCollapsed')) {
				this.set('isCollapsed', true);
			}
		}
	});
});