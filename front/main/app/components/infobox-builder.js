import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isPreviewItemDragged'],
	toolTipPosX: null,
	toolTipPosY: null,
	toolTipDistanceFromCursor: 20,
	isPreviewItemHovered: false,
	isPreviewItemDragged: false,
	isReorderTooltipVisible: Ember.computed('isPreviewItemHovered', 'isPreviewItemDragged', function () {
		return this.get('isPreviewItemHovered') && !this.get('isPreviewItemDragged');
	}),

	actions: {
		showReorderTooltip(posX, posY) {
			this.setProperties({
				toolTipPosX: posX + this.get('toolTipDistanceFromCursor'),
				toolTipPosY: posY,
				isPreviewItemHovered: true
			});
		},
		hideReorderTooltip() {
			this.setProperties({
				isPreviewItemHovered: false,
				toolTipPosX: null,
				toolTipPosy: null
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
