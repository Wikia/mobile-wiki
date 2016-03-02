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

			if (actionTrigger !== this.get('activeItem')) {
				this.get('setEditItem')(null);
			}
		},

		onPreviewItemDrop() {
			this.set('isPreviewItemDragged', false);
		},

		/**
		 * After clicking on item propagates to .infobox-builder-preview
		 * We don't want that so it's prevented here
		 *
		 * @param {Ember.Object} model
		 * @param {jQuery.Event} event
		 */
		setEditItem(model, event) {
			if (event && event.stopPropagation) {
				event.stopPropagation();
			}

			this.get('setEditItem')(model);
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
