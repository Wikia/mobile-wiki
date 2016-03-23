import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	actions: {
		onInputFocus() {
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
