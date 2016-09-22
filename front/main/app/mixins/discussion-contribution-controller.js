import Ember from 'ember';
import {isUnauthorizedError} from 'ember-ajax/errors';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	currentUser: Ember.inject.service(),
	modalDialog: Ember.inject.service(),
	discussion: Ember.inject.controller(),


	isAnon: Ember.computed.not('currentUser.isAuthenticated'),

	editorState: null,
	editEditorState: null,
	guidelinesEditorState: null,

	setEditorState: Ember.on('init', function () {
		this.setDefaultStates();
	}),

	setDefaultStates() {
		this.set('editorState', Ember.Object.create({
			errorMessage: null,
			isLoading: false,
			isOpen: false,
		}));

		this.set('editEditorState', Ember.Object.create({
			errorMessage: null,
			isLoading: false,
			isOpen: false,
			discussionEntity: null,
		}));

		this.set('guidelinesEditorState', Ember.Object.create({
			errorMessage: null,
			isLoading: false,
			isOpen: false,
			guidelines: null,
		}));
	},

	/**
	 * Get object that contains editor state
	 *
	 * @param {string} editorType type of editor - available 'contributeEditor', 'editEditor' and 'guidelinesEditor'
	 *
	 * @returns {object}
	 */
	getEditorState(editorType) {
		if (editorType === 'contributeEditor') {
			return this.get('editorState');
		} else if (editorType === 'editEditor') {
			return this.get('editEditorState');
		} else if (editorType === 'guidelinesEditor') {
			return this.get('guidelinesEditorState');
		} else {
			throw new Error(`Editor type not supported: ${editorType}`);
		}
	},

	/**
	 * If discussionEntity exists, return it's own flag, if not - fall back to main model flag
	 * @param discussionEntity
	 * @returns {Ember.Object}
	 */
	getUserBlockDetails(discussionEntity) {
		if (discussionEntity && discussionEntity.get('isRequesterBlocked')) {
			return discussionEntity.get('userBlockDetails');
		} else if (this.get('model.current.data.isRequesterBlocked')) {
			return this.get('model.current.data.userBlockDetails');
		}

		return null;
	},

	getUserProfileAnchor(username) {
		if (!username) {
			return '';
		}

		const profileUrl = M.buildUrl({
			namespace: 'User',
			title: username,
		});

		return `<a href=${profileUrl}>${username}</a>`;
	},

	/**
	 * Set editor active state
	 *
	 * @param {string} editorType editor type, available types see: getEditorState
	 *
	 * @returns {void}
	 */
	activateEditor(editorType, discussionEntity) {
		const editorState = this.getEditorState(editorType);

		if (editorState.get('isOpen')) {
			return;
		}

		if (this.get('isAnon')) {
			this.rejectAnon();
			return;
		}

		const userBlockDetails = this.getUserBlockDetails(discussionEntity);

		if (userBlockDetails) {
			this.rejectBlockedUser(userBlockDetails);
			return;
		}

		editorState.setProperties({
			errorMessage: null,
			isOpen: true,
		});
	},

	/**
	 * Renders a message to display to an anon
	 * @returns {void}
	 */
	rejectAnon() {
		this.openDialog({
			message: i18n.t('editor.post-error-anon-cant-post', {ns: 'discussion'}),
		});
	},

	/**
	 * Renders a message to display to a blocked user
	 * @returns {void}
	 */
	rejectBlockedUser(userBlockDetails) {
		this.openDialog({
			header: i18n.t('editor.post-error-user-blocked-title', {ns: 'discussion'}),
			message: i18n.t('editor.post-error-user-blocked-text', {
				blockerUsername: this.getUserProfileAnchor(userBlockDetails.get('blockedBy')),
				blockExpiry: new Date(Number(userBlockDetails.get('blockExpiry'))).toLocaleString(),
				blockReason: userBlockDetails.get('blockReason'),
				ns: 'discussion',
			}),
		});
	},

	/**
	 * Opens a modal dialog with translated message
	 * @param {Object} openDialogParams params for display modal method [see: modalDialog::display]
	 * @param {string} openDialogParams.message text for dialog modal body message
	 * @param {string} [openDialogParams.header] text for dialog modal title
	 * @returns {void}
	 */
	openDialog(openDialogParams) {
		const displayParams = Object.assign(
			{},
			{name: 'modal-dialog-posting-not-allowed'},
			openDialogParams,
		);

		this.get('modalDialog').display(displayParams);
	},

	/**
	 * @param {string} editorType editor type, available types see: getEditorState
	 * @param {error} err
	 * @param {string} generalErrorKey
	 *
	 * @returns {void}
	 */
	onContributionError(editorType, err, generalErrorKey) {
		if (isUnauthorizedError(editorType, err.status)) {
			this.setEditorError('editor.post-error-not-authorized');
		} else {
			this.setEditorError(editorType, generalErrorKey);
		}
	},

	/**
	 * @param {string} editorType editor type, available types see: getEditorState
	 * @param {string} errorMessage
	 *
	 * @returns {void}
	 */
	setEditorError(editorType, errorMessage) {
		const editorState = this.getEditorState(editorType);

		editorState.set('errorMessage', errorMessage);

		if (errorMessage) {
			Ember.run.later(this, () => {
				editorState.set('errorMessage', null);
			}, 3000);
		}
	},

	createPost(entityData, params) {
		const editorType = 'contributeEditor',
			editorState = this.getEditorState(editorType),
			catId = params.newCategoryId;

		editorState.set('isLoading', true);
		this.setEditorError(editorType, null);

		this.get('model').current.createPost(entityData, catId).then(() => {
			Ember.run.later(this, () => {
				this.selectCategoryIfNotSelected(catId);
			}, 2000);
		}).catch((err) => {
			this.onContributionError(editorType, err, 'editor.post-error-general-error');
		}).finally(() => {
			editorState.set('isLoading', false);
		});
	},

	/**
	 * @private
	 *
	 * Checks if category with given id is selected, if not category is selected and threads are refreshed.
	 *
	 * @param {number} catId - category id
	 *
	 * @returns {void}
	 */
	selectCategoryIfNotSelected(catId) {
		let localCategories = this.get('model.index.categories.categories')
				.map(category => {
					return Ember.Object.create({
						category,
						id: category.id,
						selected: category.selected
					});
				}),
			selectedCategories = localCategories.filterBy('selected', true);

		if (!this.allIsSelected(selectedCategories) && this.categoryIsNotSelected(selectedCategories, catId)) {
			localCategories.findBy('id', catId).set('selected', true);

			this.get('target').send('updateCategoriesSelection', localCategories);
		}
	},

	/**
	 * @private
	 *
	 * Checks if at least one category is selected, if not it assumes that 'All' in categories filter is selected
	 *
	 * @param {Ember.Array} selectedCategories
	 *
	 * @returns {boolean}
	 */
	allIsSelected(selectedCategories) {
		return Ember.isEmpty(selectedCategories);
	},

	/**
	 * @private
	 *
	 * @param {Ember.Array} selectedCategories
	 * @param {number} categoryId
	 *
	 * @returns {boolean}
	 */
	categoryIsNotSelected(selectedCategories, categoryId) {
		return Ember.isEmpty(selectedCategories.filterBy('id', categoryId));
	},

	actions: {
		/**
		 * Set editor active state
		 *
		 * @param {string} editorType editor type, available types see: getEditorState
		 * @param {boolean} active desired state of editor
		 * @param {Ember.Object} discussionEntity if it's an edit
		 *
		 * @returns {void}
		 */
		setEditorActive(editorType, active, discussionEntity) {
			if (active === true) {
				this.activateEditor(editorType, discussionEntity);
			} else {
				this.getEditorState(editorType).setProperties({
					errorMessage: null,
					isOpen: false,
					discussionEntity: null,
					guidelines: null,
				});
			}
		},

		/**
		 * Sets discussion entity for editor
		 *
		 * @param {DiscussionEntity} discussionEntity
		 *
		 * @returns {void}
		 */
		openEditEditor(discussionEntity) {
			this.send('setEditorActive', 'editEditor', true, discussionEntity);
			Ember.run.scheduleOnce('afterRender', this, function () {
				// set editor content after render so textarea autoresize can correctly calculate height
				this.set('editEditorState.discussionEntity', discussionEntity);
			});
		},

		/**
		 * Sets discussion entity for editor
		 *
		 * @param {DiscussionSiteAttribute} guidelines
		 *
		 * @returns {void}
		 */
		openGuidelinesEditor(guidelines) {
			this.send('setEditorActive', 'guidelinesEditor', true);
			Ember.run.scheduleOnce('afterRender', this, function () {
				// set editor content after render so textarea autoresize can correctly calculate height
				this.set('guidelinesEditorState.guidelines', guidelines);
			});
		},

		/**
		 * Upvote discussion entity
		 *
		 * @param {Object} post
		 * @returns {void}
		 */
		upvote(post) {
			this.get('model').current.upvote(post);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		createPost(entityData, params) {
			this.createPost(entityData, params.newCategoryId);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @param {Object} params
		 * @returns {void}
		 */
		editPost(entityData, params) {
			const editorType = 'editEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').current.editPost(entityData, params).catch((err) => {
				this.onContributionError(editorType, err, 'editor.save-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		createReply(entityData) {
			const editorType = 'contributeEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').current.createReply(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.reply-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		editReply(entityData) {
			const editorType = 'editEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').current.editReply(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.save-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * This saves the new Guidelines.
		 * @param {Object} text
		 * @returns {void}
		 */
		saveGuidelines(text) {
			const editorType = 'guidelinesEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('discussion.model').attributes.saveTextAttribute('guidelines', text).then(() => {
				track(trackActions.GuidelinesEditSave);
			}).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error', true);
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * This uploads the new community badge image
		 * @param {Object} image
		 * @returns {Ember.RSVP.Promise} Promise object uploading the image to the site-attributes server
		 */
		uploadCommunityBadge(image) {
			return this.get('discussion.model').attributes.saveImageAttribute('badgeImage', image);
		},

		/**
		 * This uploads the new discussions header image
		 * @param {Object} image
		 * @returns {Ember.RSVP.Promise} Promise object uploading the image to the site-attributes server
		 */
		uploadDiscussionsHeader(image) {
			return this.get('discussion.model').attributes.saveImageAttribute('heroImage', image);
		},
	},
});
