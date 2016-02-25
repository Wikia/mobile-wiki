import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isPreviewItemDragged'],
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
			this.get('handleItemInEditModel')(actionTrigger);
		},
		onPreviewItemDrop() {
			this.set('isPreviewItemDragged', false);

		}
	}
});
