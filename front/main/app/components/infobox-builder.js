import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isPreviewItemDragged'],

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
