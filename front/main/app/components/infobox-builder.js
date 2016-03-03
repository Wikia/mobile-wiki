import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isPreviewItemDragged'],
	isLoading: false,
	showSuccess: false,
	tooltipPosX: null,
	tooltipPosY: null,
	tooltipDistanceFromCursor: 20,
	isPreviewItemHovered: false,
	isPreviewItemDragged: false,
	scrollDebounceDuration: 200,
	scrollAnimateDuration: 200,

	showOverlay: Ember.computed.or('isLoading', 'showSuccess'),

	isReorderTooltipVisible: Ember.computed('isPreviewItemHovered', 'isPreviewItemDragged', function () {
		return this.get('isPreviewItemHovered') && !this.get('isPreviewItemDragged');
	}),

	actions: {
		addItem() {
			this.get('addItem')(...arguments);

			Ember.run.scheduleOnce('afterRender', this, () => {
				Ember.run.debounce(this, this.scrollPreviewToBottom, this.get('scrollDebounceDuration'));
			});
		},

		showReorderTooltip(posX, posY) {
			this.setProperties({
				tooltipPosX: posX + this.get('tooltipDistanceFromCursor'),
				tooltipPosY: posY,
				isPreviewItemHovered: true
			});
		},

		hideReorderTooltip() {
			this.setProperties({
				isPreviewItemHovered: false,
				tooltipPosX: null,
				tooltipPosy: null
			});
		},

		onPreviewItemDrag(actionTrigger) {
			this.set('isPreviewItemDragged', true);
			this.get('handleItemInEditMode')(actionTrigger);
		},

		onPreviewItemDrop() {
			this.set('isPreviewItemDragged', false);
		},

		save() {
			this.set('isLoading', true);
			this.get('saveAction')().then(() =>
				this.setProperties({
					isLoading: false,
					showSuccess: true
				})
			);
		}
	},

	/**
	 * Scroll to the bottom of preview element minus its height
	 * If we scrolled to the scrollHeight there would be visual glitches
	 *
	 * @returns {void}
	 */
	scrollPreviewToBottom() {
		const $preview = this.$('.infobox-builder-preview'),
			scrollHeight = $preview.prop('scrollHeight'),
			scrollTop = $preview.prop('scrollTop'),
			height = $preview.height();

		if (scrollTop + height < scrollHeight) {
			$preview.animate({
				scrollTop: scrollHeight - height
			}, this.get('scrollAnimateDuration'));
		}
	}
});
