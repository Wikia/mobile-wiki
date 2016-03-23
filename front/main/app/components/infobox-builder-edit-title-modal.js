import Ember from 'ember';
import {track} from 'common/utils/track';

export default Ember.Component.extend({
	untitledTemplate: i18n.t('infobox-builder:main.untitled-infobox-template'),

	actions: {
		onInputFocus() {
			if (this.get('title') === this.get('untitledTemplate')) {
				this.set('title', '');
			}

			track({
				action: 'focus',
				category: 'infobox-builder',
				label: 'edit-template-title'
			});
		},

		onInputBlur() {
			track({
				action: 'focus',
				category: 'infobox-builder',
				label: 'edit-template-title'
			});
		}
	}
});
