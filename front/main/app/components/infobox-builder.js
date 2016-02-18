import Ember from 'ember';

export default Ember.Component.extend({
	init() {
		this._super(...arguments);
		this.cursorPosX = null;
		this.cursorPosY = null;
		this.isPreviewItemHovered = false;
		this.isPreviewItemDragged = false;
		this.isReorderTooltipVisible = Ember.computed('isPreviewItemHovered', 'isPreviewItemDragged', function () {
			return this.get('isPreviewItemHovered') && !this.get('isPreviewItemDragged');
		});
	},

	actions: {
		showReorderTooltip(posX, posY) {
			this.set('cursorPosX', posX);
			this.set('cursorPosY', posY);
			this.set('isPreviewItemHovered', true);
		},
		hideReorderTooltip() {
			this.set('isPreviewItemHovered', false);
			this.set('cursorPosX', null);
			this.set('cursorPosY', null);
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