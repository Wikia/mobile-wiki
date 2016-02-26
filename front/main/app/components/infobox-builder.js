import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isPreviewItemDragged'],
	isLoading: false,
	showSuccess: false,
	showOverlay: Ember.computed.or('isLoading', 'showSuccess'),
	tooltipPosX: null,
	tooltipPosY: null,
	tooltipDistanceFromCursor: 20,
	isPreviewItemHovered: false,
	isPreviewItemDragged: false,
	isReorderTooltipVisible: Ember.computed('isPreviewItemHovered', 'isPreviewItemDragged', function () {
		return this.get('isPreviewItemHovered') && !this.get('isPreviewItemDragged');
	}),

	actions: {
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
	}
});
