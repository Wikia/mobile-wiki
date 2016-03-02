import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
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

		trackChangedItems() {
			const diffArray = this.get('getDiffArray')();

			diffArray.forEach((element) =>
				this.trackClick('infobox-builder', `changed-element-${element.type}-${element.changedField}`)
			);
		},

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
				this.trackClick('infobox-builder', `dragging-element-${actionTrigger.type}`);
				this.get('handleItemInEditMode')(actionTrigger);
			},

			onPreviewItemDrop() {
				this.set('isPreviewItemDragged', false);
			},

			save() {
				this.set('isLoading', true);

				this.trackClick('infobox-builder', 'saving-attempt');
				this.trackChangedItems();
				this.get('saveAction')().then(() => {
					this.trackClick('infobox-builder', 'saving-successful');
					this.setProperties({
						isLoading: false,
						showSuccess: true
					});
				});
			},

			cancel() {
				this.trackClick('infobox-builder', 'navigate-back-from-builder');
				this.get('cancelAction')();
			}
		}
	}
);
