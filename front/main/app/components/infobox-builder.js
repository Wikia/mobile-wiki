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
		showGoToSourceModal: false,
		isEditTitleModalVisible: false,
		editTitleModalTrigger: null,
		titleExists: false,
		initialTitle: null,

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

		isEditPopOverVisible: Ember.computed('activeItem', 'isPreviewItemDragged', function () {
			return Boolean(this.get('activeItem')) && !this.get('isPreviewItemDragged');
		}),

		infoboxTemplateTitle: Ember.computed('title', function () {
			return this.get('title') || i18n.t('infobox-builder:main.untitled-infobox-template');
		}),

		editTitleModalConfirmButtonLabel: Ember.computed('editTitleModalTrigger', function () {
			const messageKey = this.get('editTitleModalTrigger') === 'publish' ?
				'edit-title-modal-publish' :
				'edit-title-modal-ok';

			return i18n.t(`main.${messageKey}`, {
				ns: 'infobox-builder'
			});
		}),

		showEditTitleModalCancelButton: Ember.computed('editTitleModalTrigger', function () {
			return this.get('editTitleModalTrigger') !== 'publish';
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

			hideEditTitleModal() {
				this.hideEditTitleModal();
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
			publish() {
				if (this.get('title')) {
					this.save();
				} else {
					this.showEditTitleModal('publish');
				}
			},

			/**
			 * @returns {void}
			 */
			cancel() {
				this.trackClick('infobox-builder', 'navigate-back-from-builder');
				this.get('cancelAction')();
			},

			/**
			 * @returns {void}
			 */
			tryGoToSource() {
				this.trackClick('infobox-builder', 'go-to-source-icon');

				if (this.get('title')) {
					if (this.get('isDirty')) {
						this.set('showGoToSourceModal', true);
					} else {
						this.handleGoToSource();
					}
				} else {
					this.showEditTitleModal('tryGoToSource');
				}
			},

			/**
			 * @param {Boolean} saveChanges
			 * @returns {void}
			 */
			goToSource(saveChanges) {
				const trackingLabel = `go-to-source-modal-${saveChanges ? 'save-changes-and-' : ''}go-to-source`;

				this.trackClick('infobox-builder', trackingLabel);
				this.set('showGoToSourceModal', false);
				this.handleGoToSource(saveChanges);
			},

			/**
			 * Check if title can be changed - check if it doesn't exist already.
			 * Do not perform request when changing back to initial title - name
			 * will always exist in this case.
			 *
			 * @param {String} title
			 * @returns {void}
			 */
			onTemplateTitleChangeAttempt(title) {
				if (title === this.get('initialTitle')) {
					this.changeTemplateTitle(title);
				} else {
					this.get('getTemplateExistsAction')(title).then((exists) => {
						this.set('titleExists', exists);

						if (!exists) {
							this.changeTemplateTitle(title);
						}
					});
				}
			},

			/**
			 * @returns {void}
			 */
			onPreviewBackgroundClick() {
				if (this.get('activeItem') !== null) {
					this.trackClick('infobox-builder', 'exit-edit-mode-by-clicking-on-preview-background');
				}
				this.get('setEditItem')(null);
			},

			editTitle() {
				this.showEditTitleModal();
			}
		},

		/**
		 * @param {Boolean} [shouldRedirectToPage=true]
		 * @returns {Ember.RSVP.Promise}
		 */
		save(shouldRedirectToPage = true) {
			this.setProperties({
				isLoading: true,
				loadingMessage: i18n.t('main.saving', {
					ns: 'infobox-builder'
				})
			});

			this.trackClick('infobox-builder', 'save-attempt');
			this.trackChangedItems();

			return this.get('saveAction')(shouldRedirectToPage).then(() => {
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
		 * Shows loading spinner and message, then sends action to controller to redirect to source editor
		 * If model is dirty, asks user if changes should be saved
		 * If user wants to save changes it does that and only then redirects
		 *
		 * @param {Boolean} saveChanges
		 * @returns {Ember.RSVP.Promise} return promise so it's always async and testable
		 */
		handleGoToSource(saveChanges = false) {
			const controllerAction = this.get('goToSourceEditor'),
				loadingMessage = i18n.t('main.source-editor-loading', {
					ns: 'infobox-builder'
				});

			return new Ember.RSVP.Promise((resolve) => {
				if (saveChanges) {
					this.save(false).then(() => {
						controllerAction();
						resolve();
					});
				} else {
					this.setProperties({
						isLoading: true,
						loadingMessage
					});
					controllerAction();
					resolve();
				}
			});
		},

		/**
		 * Set new title, hide modal and call callback function if set.
		 *
		 * @param {String} title new title
		 * @returns {void}
		 */
		changeTemplateTitle(title) {
			const callback = this.get('editTitleModalTrigger');

			this.set('title', title);
			this.hideEditTitleModal();

			if (callback) {
				this.send(callback);
			}
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
		},

		/**
		 * @param {String} trigger true if showing modal, false if hiding
		 * @returns {void}
		 */
		showEditTitleModal(trigger) {
			track({
				action: trackActions.open,
				category: 'infobox-builder',
				label: `edit-title-modal-before-triggered-on-${trigger}`
			});

			this.setProperties({
				editTitleModalTrigger: trigger,
				isEditTitleModalVisible: true
			});
		},

		/**
		 * @returns {void}
		 */
		hideEditTitleModal() {
			track({
				action: trackActions.close,
				category: 'infobox-builder',
				label: 'edit-title-modal'
			});

			this.set('editTitleModalTrigger', null);
			this.set('isEditTitleModalVisible', false);
		}
	}
);
