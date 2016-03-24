import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	untitledTemplate: i18n.t('infobox-builder:main.untitled-infobox-template'),
	value: Ember.computed('title', function () {
		return this.get('title') || '';
	}),
	isConfirmButtonDisabled: Ember.computed('value', function () {
		return this.get('value').trim() === '';
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
});
