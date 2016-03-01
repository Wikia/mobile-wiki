import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	classNames: ['article-edit-highlighted-entrypoint'],
	classNameBindings: ['displayEdit'],
	displayEdit: Ember.computed('showEdit', function () {
		const showEdit = this.get('showEdit');

		let className = '';

		if (showEdit === true) {
			className = 'show-edit';
		} else if (showEdit === false) {
			className = 'hide-edit';
		}

		return className;
	}),
	actions: {
		editSection() {
			this.sendAction('edit', this.get('title'), this.get('section'), this.get('highlightedText'));
			if (this.get('editAllowed')) {
				track({
					action: trackActions.click,
					category: 'highlighted-editor',
					label: 'entry-point-allowed'
				});
			} else {
				track({
					action: trackActions.click,
					category: 'highlighted-editor',
					label: 'entry-point-not-allowed'
				});
			}
		}
	}
});
