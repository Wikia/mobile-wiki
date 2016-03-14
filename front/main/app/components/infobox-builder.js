import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import infoboxBuilderDiff from '../utils/infobox-builder-diff';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	TrackClickMixin,
	{
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

		sortableGroupClassNames: Ember.computed('theme', function () {
			const theme = this.get('theme'),
				classNames = ['portable-infobox', 'pi-background'];

			if (theme) {
				classNames.push(`pi-theme-${theme}`);
			}

			return classNames.join(' ');
		}),

		sideBarOptionsComponent: Ember.computed('activeItem', function () {
			return this.get('activeItem') ?
				`infobox-builder-edit-item-${this.get('activeItem.type')}` :
				'infobox-builder-add-items';
		}),

		actions: {
			/**
			 * @param {String} type
			 * @returns {void}
			 */
			addItem(type) {
				this.trackClick('infobox-builder', `add-item-${type}`);

				this.get('addItem')(type);

				Ember.run.scheduleOnce('afterRender', this, () => {
					Ember.run.debounce(this, this.scrollPreviewToBottom, this.get('scrollDebounceDuration'));
				});
			},

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
				this.trackClick('infobox-builder', `drag-element-${actionTrigger.type}`);

				if (actionTrigger !== this.get('activeItem')) {
					this.get('setEditItem')(null);
				}
			},

			onPreviewItemDrop() {
				this.set('isPreviewItemDragged', false);
			},

			/**
			 * @param {Ember.Array} newState
			 * @param {Ember.Object} movedItem
			 * @returns {void}
			 */
			onReorderElements(newState, movedItem) {
				if (newState.indexOf(movedItem) !== this.get('state').indexOf(movedItem)) {
					track({
						action: trackActions.change,
						category: 'infobox-builder',
						label: 'reorder-infobox-elements'
					});
				}

				this.get('reorder')(newState);
			},

			/**
			 * Clicking on item propagates to .infobox-builder-preview
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

				this.trackClick('infobox-builder', `item-${targetItem.type}`);

				this.get('setEditItem')(targetItem);
			},

			/**
			 * @returns {void}
			 */
			save() {
				this.save();
			},

			/**
			 * @returns {void}
			 */
			cancel() {
				this.trackClick('infobox-builder', 'navigate-back-from-builder');
				this.get('cancelAction')();
			},

			/**
			 * Shows loading spinner and message, then sends action to controller to redirect to source editor
			 * If model is dirty, asks user if changes should be saved
			 * If user wants to save changes it does that and only then redirects
			 *
			 * @returns {void}
			 */
			goToSourceEditor() {
				const controllerAction = this.get('goToSourceEditor'),
					confirmationMessage = i18n.t('main.source-editor-save-confirmation', {
						ns: 'infobox-builder'
					}),
					loadingMessage = i18n.t('main.source-editor-loading', {
						ns: 'infobox-builder'
					});

				if (this.get('isDirty') && window.confirm(confirmationMessage)) {
					this.save(false).then(() => {
						controllerAction();
					});
				} else {
					this.setProperties({
						isLoading: true,
						loadingMessage
					});

					controllerAction();
				}
			},

			onPreviewBackgroundClick() {
				if (this.get('activeItem') !== null) {
					this.trackClick('infobox-builder', 'exit-edit-mode-by-clicking-on-preview-background');
				}
				this.get('setEditItem')(null);
			}
		},

		/**
		 * @param {Boolean} [shouldRedirectToTemplatePage=true]
		 * @returns {Ember.RSVP.Promise}
		 */
		save(shouldRedirectToTemplatePage = true) {
			this.setProperties({
				isLoading: true,
				loadingMessage: i18n.t('main.saving', {
					ns: 'infobox-builder'
				})
			});

			this.trackClick('infobox-builder', 'save-attempt');
			this.trackChangedItems();

			return this.get('saveAction')(shouldRedirectToTemplatePage).then(() => {
				track({
					action: trackActions.success,
					category: 'infobox-builder',
					label: 'save-successful'
				});

				this.setProperties({
					isLoading: false,
					showSuccess: true
				});
			});
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
		},

		/**
		 * @returns {void}
		 */
		trackChangedItems() {
			const diffArray = infoboxBuilderDiff(this.get('state'));

			diffArray.forEach((element) => {
				track({
					action: trackActions.change,
					category: 'infobox-builder',
					label: `changed-element-${element.type}-${element.changedField}`
				});
			});
		}
	}
);
