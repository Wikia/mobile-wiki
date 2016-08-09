import DiscussionEditor from './discussion-editor';
import {track} from '../utils/discussion-tracker';

export default DiscussionEditor.extend({

	title: '',

	// Labels below need to be overwritten in subclasses
	titleLabelKey: null,
	titlePlaceholderKey: null,
	messageLabelKey: null,

	// Tracking action name of inserting title into editor
	titleTrackingAction: null,
	wasTitleTracked: false,

	/**
	 * Overridden to clear title also.
	 *
	 * @returns {void}
	 */
	afterSuccess() {
		this.setProperties({
			content: '',
			title: '',
			showSuccess: false,
		});
		this.sendAction('setEditorActive', this.get('editorType'), false);
		this.scrollAfterEntityAdded();
	},

	focusOnNearestTextarea(event) {
		if (this.get('isActive')) {
			let $target = this.$(event.target),
				$label = $target.closest('label');

			if (Ember.isEmpty($label)) {
				$label = $target.children('label:last');
			}
			$label.find('textarea').focus();
		} else {
			this.$('textarea:first').focus();
		}
	},

	actions: {
		onTitleChange(title) {
			this.set('title', title);
		},

		handleKeyPressOnTitle() {
			if (!this.get('wasTitleTracked') && Ember.isPresent(this.get('titleTrackingAction'))) {
				track(this.get('titleTrackingAction'));
				this.set('wasTitleTracked', true);
			}
		}
	}
});
