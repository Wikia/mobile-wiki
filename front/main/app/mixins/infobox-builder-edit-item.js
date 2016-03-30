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
		 * Focuses on the end of the first text input element of this component
		 * @returns {void}
		 */
		focusFirstInput() {
			const $firstInput = this.$('.text-field-input').get(0);

			if ($firstInput) {
				$firstInput.focus();
				// required for moving cursor to the end of input on FF
				$firstInput.selectionStart = $firstInput.selectionEnd = $firstInput.value.length;
			}
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

		actions: {
			/**
			 * ember-keyboard add-on prevents Ember.TextField and Ember.TextArea from responding to key events attached
			 * by ember-keyboard api. In order to have consistent functionality while being focused inside input we
			 * need to trigger them manually. 
			 * @param {Event} event
			 * @returns {void}
			 */
			handleKeyboardActionsInsideFocusedInput(event) {
				// stop propagation of click event to prevent triggering selectPrevious / selectNext two tiems
				// when switching from item with focused input to item without input where ember-keyboard add-on
				// handles keyboard events
				event.stopPropagation();

				const supportedKeyboardActions = {
						// onEnterHandler
						13: this.get('exitEditMode'),
						// onEscapeHandler
						27: this.get('exitEditMode'),
						// on ArrowUpHandler
						38: this.get('selectPreviousActiveItem'),
						// onArrowDownHandler
						40: this.get('selectNextActiveItem')
					},
					actionHandler = supportedKeyboardActions[event.keyCode];

				if (typeof actionHandler === 'function') {
					actionHandler();
				}

			}
		}
	}
);
