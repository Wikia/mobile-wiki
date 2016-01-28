import TrackClickMixin from '../mixins/track-click';
import IEIFrameFocusFixMixin from '../mixins/ieiframe-focus-fix';

export default Ember.Component.extend(
	TrackClickMixin,
	IEIFrameFocusFixMixin,
	{
		classNames: ['curated-content-editor-wikia-description', 'curated-content-editor-block'],
		isHelpVisible: false,

		isLabelFocused: false,
		isLabelNotEmpty: Ember.computed.notEmpty('model.description'),
		isLabelActive: Ember.computed.or('isLabelNotEmpty', 'isLabelFocused'),

		actions: {
			/**
			 * @returns {void}
			 */
			setLabelFocusedOut() {
				this.set('isLabelFocused', false);
			},

			/**
			 * @returns {void}
			 */
			setLabelFocusedIn() {
				this.set('isLabelFocused', true);
			},

			/**
			 * @returns {void}
			 */
			showHelp() {
				this.trackClick('curated-content-editor', 'help-show');
				this.set('isHelpVisible', true);
			}
		}
	}
);

