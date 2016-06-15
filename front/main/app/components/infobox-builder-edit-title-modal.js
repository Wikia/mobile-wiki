import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import InfoboxBuilderInputAutoFocusMixin from '../mixins/infobox-builder-input-auto-focus';

export default Ember.Component.extend(
	InfoboxBuilderInputAutoFocusMixin,
	{
		untitledTemplate: i18n.t('infobox-builder:main.untitled-infobox-template'),
		value: Ember.computed('title', function () {
			return this.get('title') || '';
		}),

		/**
		 * On each value in input change, reset error.
		 */
		valueObserver: Ember.observer('value', function () {
			this.set('titleExists', false);
			this.set('titleInvalid', false);
		}),

		isConfirmButtonDisabled: Ember.computed('value', 'errorMessage', function () {
			return !this.get('value').trim() || this.get('errorMessage');
		}),

		errorMessage: Ember.computed('titleExists', 'titleInvalid', function () {
			switch (true) {
				case this.get('titleExists'):
					return i18n.t('main.title-naming-conflict-error', {
						ns: 'infobox-builder'
					});
				case this.get('titleInvalid'):
					return i18n.t('main.title-naming-invalid-title-error', {
						ns: 'infobox-builder'
					});
				default: return '';
			}
		}),

		actions: {
			onInputFocus() {
				track({
					action: trackActions.focus,
					category: 'infobox-builder',
					label: 'edit-template-title-input'
				});
			}
		}
	}
);
