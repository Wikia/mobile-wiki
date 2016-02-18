import Ember from 'ember';

export default Ember.Component.extend({
	init() {
		this._super(...arguments);
		this.toolTipPosX = null;
		this.toolTipPosY = null;
		this.toolTipDistanceFromCursor = 20;
		this.isPreviewItemHovered = false;
		this.isPreviewItemDragged = false;
		this.isReorderTooltipVisible = Ember.computed('isPreviewItemHovered', 'isPreviewItemDragged', function () {
			return this.get('isPreviewItemHovered') && !this.get('isPreviewItemDragged');
		});
	},

	actions: {
		showReorderTooltip(posX, posY) {
			this.set('toolTipPosX', posX + this.get('toolTipDistanceFromCursor'));
			this.set('toolTipPosY', posY);
			this.set('isPreviewItemHovered', true);
		},
		hideReorderTooltip() {
			this.set('isPreviewItemHovered', false);
			this.set('toolTipPosX', null);
			this.set('toolTipPosy', null);
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