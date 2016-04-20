import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Mixin.create(
	{
		/**
		 * allows to set item property after liquid-fire animation happened
		 */
		item: Ember.on('init', function () {
			this.set('item', this.get('itemModel'));
		}),

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

		actions: {
			/**
			 * @param {Event} event
			 * @returns {void}
			 */
			onEnterKeyUpInsideFocusedInput(event) {
				const actionHandler = this.get('exitEditMode'),
					enterKeyCode = 13;

				if (event.keyCode === enterKeyCode && typeof actionHandler === 'function') {
					track({
						action: trackActions.keypress,
						category: 'infobox-builder',
						label: `exit-edit-mode-on-enter-key-up`
					});
					actionHandler();
				}
			}
		}
	}
);
