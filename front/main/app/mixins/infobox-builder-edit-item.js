import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Mixin.create(
	TrackClickMixin,
	{
		isHelpVisible: false,
		classNames: ['sidebar-content-padding'],

		actions: {
			showHelp() {
				this.trackClick('infobox-builder', `show-help-tooltip-${this.get('item.type')}`);
				this.set('isHelpVisible', true);
			}
		},

		/**
		 * @desc tracks focus on different edit options
		 * @param {String} action - tracking action
		 * @param {String} option - clicked element name
		 * @returns {void}
		 */
		trackEditItemOption(action, option) {
			this[`track${action.toUpperCase()}`]('infobox-builder', `edit-item-${this.get('item.type')}-${option}`);
		}
	}
);
