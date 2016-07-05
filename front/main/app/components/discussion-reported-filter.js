import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

export default Ember.Component.extend(DiscussionModalDialogMixin, {
	tagName: 'fieldset',
	classNames: ['discussion-fieldset', 'moderation-fieldset', ],
	discussionSort: Ember.inject.service(),
	onlyReported: Ember.computed.oneWay('discussionSort.onlyReported'),

	actions: {
		/**
		 * @param {Event} event
		 *
		 * @returns {void}
		 */
		toggleReported(event) {
			event.preventDefault();

			const onlyReported = this.get('onlyReported');

			if (onlyReported === false) {
				this.send('setSortBy', 'latest');
			}

			this.set('onlyReported', !onlyReported);

			if (!this.get('showApplyButton')) {
				this.send('applyFilters');
			}
		},
	}
});
