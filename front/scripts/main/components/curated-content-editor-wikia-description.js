import TrackClickMixin from '../mixins/track-click';
import IEIFrameFocusFixMixin from '../mixins/ieiframe-focus-fix';

export default Ember.Component.extend(
	TrackClickMixin,
	IEIFrameFocusFixMixin,
	{
		classNames: ['curated-content-editor-wikia-description', 'curated-content-editor-block'],
		debounceDuration: 300,
		spinnerOverlay: false,

		isTooltipVisible: false,

		isLabelFocused: false,
		isLabelNotEmpty: Ember.computed.notEmpty('model.description'),
		isLabelActive: Ember.computed.or('isLabelNotEmpty', 'isLabelFocused'),

		actions: {
			/**
			 * @returns {void}
			 */
			setLabelFocusedOut()
			{
				this.validateDescription();
				this.set('isLabelFocused', false);
			},

			/**
			 * @returns {void}
			 */
			setLabelFocusedIn()
			{
				this.set('isLabelFocused', true);
			},

			/**
			 * @param {string} tooltipMessage
			 * @returns {void}
			 */
			showTooltip(tooltipMessage) {
				this.trackClick('curated-content-editor', 'tooltip-show');
				this.setProperties({
					tooltipMessage,
					isTooltipVisible: true
				});
			},

			save() {
				console.log("save")
			}
		},

		/**
		 * @returns {boolean} is description valid
		 */
		validateDescription() {
			let description = this.get('model.description'),
				errorMessage = null;

			if (Ember.isEmpty(description)) {
				errorMessage = i18n.t('app.curated-content-editor-missing-wikia-description-error');
				this.set('titleErrorMessage', errorMessage);
				return !errorMessage;
			}

			return true;
		}
	}
);
