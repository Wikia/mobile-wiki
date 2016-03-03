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
				this.trackChange('infobox-builder', `changed-element-${element.type}-${element.changedField}`)
			);
		},

		actions: {
			/**
			 * @param {Number} posX
			 * @param {Number} posY
			 * @returns {void}
			 */
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

			/**
			 * @param {Object} actionTrigger - dragged item
			 * @returns {void}
			 */
			onPreviewItemDrag(actionTrigger) {
				this.set('isPreviewItemDragged', true);
				this.trackClick('infobox-builder', `dragging-element-${actionTrigger.type}`);

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
			 * @param {Ember.Object} targetItem
			 * @param {jQuery.Event} event
			 * @returns {void}
			 */
			setEditItemAndStopPropagation(targetItem, event) {
				if (event && event.stopPropagation) {
					event.stopPropagation();
				}

				this.get('setEditItem')(targetItem);
			},

			save() {
				this.set('isLoading', true);

				this.trackClick('infobox-builder', 'saving-attempt');
				this.trackChangedItems();
				this.get('saveAction')().then(() => {
					this.trackSuccess('infobox-builder', 'saving-successful');
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
