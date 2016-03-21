import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import {track} from 'common/utils/track';

export default Ember.Mixin.create(
	TrackClickMixin,
	{
		/**
		 * We should never change properties on components during
		 * didRender because it causes significant performance degradation.
		 * @returns {void}
		 */
		didRender() {
			this._super(...arguments);
			Ember.run.scheduleOnce('afterRender', this, 'focusFirstInput');
		},

		/**
		 * Focuses first input element of the component
		 * @returns {void}
		 */
		focusFirstInput() {
			this.$('input').first().focus();
		},
		/**
		 * Tracks events on different edit options
		 * @param {String} action - tracking action
		 * @param {String} option - clicked element name
		 * @returns {void}
		 */
		trackEditItemOption(action, option) {
			track({
				action,
				category: 'infobox-builder',
				label: `edit-item-${this.get('item.type')}-${option}`
			});
		},

		/**
		 * @param {String} originalValuePropertyName
		 * @param {String} currentValue
		 * @param {String} trackingKey
		 * @returns {void}
		 */
		handleInputFocus(originalValuePropertyName, currentValue, trackingKey) {
			// save current input value for tracking change on blur
			this.set(originalValuePropertyName, currentValue);

			// track focus on input
			this.trackEditItemOption('focus', trackingKey);
		},

		/**
		 * @param {String} valueAlteredPropertyName
		 * @param {String} originalValue
		 * @param {String} currentValue
		 * @param {String} trackingKey
		 * @returns {void}
		 */
		handleInputBlur(valueAlteredPropertyName, originalValue, currentValue, trackingKey) {
			// track interaction with input
			if (this.get(valueAlteredPropertyName)) {
				this.trackEditItemOption('keypress', trackingKey);
				this.set(valueAlteredPropertyName, false);
			}

			// track change of input value
			if (originalValue !== currentValue) {
				this.trackEditItemOption('change', trackingKey);
			}
		},

		/**
		 * @todo consider cleanup this function or move it to utils folder.
		 * Will be addressed as a part of DAT-3984
		 * @param {String} label to create id from
		 * @returns {String} unique string id
		 */
		createInputId(label) {
			return `${label}${Date.now()}`;
		}
	}
);
