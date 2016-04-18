import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(ViewportMixin, {
	attributeBindings: ['style'],

	classNames: ['discussion-editor'],
	classNameBindings: ['isActive', 'hasError'],

	currentUser: Ember.inject.service(),
	discussionEditor: Ember.inject.service(),

	isActive: false,
	isSticky: false,

	showSuccess: false,
	hasError: false,

	offsetTop: 0,
	siteHeadHeight: 0,

	bodyText: '',
	isEdit: Ember.computed.alias('discussionEditor.editMode'),
	layoutName: 'components/discussion-editor',

	/**
	 * @returns {boolean}
	 */
	submitDisabled: Ember.computed('bodyText', 'currentUser.userId', function () {
		return this.get('bodyText').length === 0 || this.get('currentUser.userId') === null;
	}),

	editorServiceStateObserver: Ember.observer('discussionEditor.isEditorOpen', function () {
		if (this.get('discussionEditor.isEditorOpen')) {
			this.afterOpenActions();
		} else {
			this.afterCloseActions();
		}
	}),

	/**
	 * Reacts on new item creation failure in the model by stopping the throbber
	 * @returns {void}
	 */
	editorLoadingObserver: Ember.observer('discussionEditor.shouldStopLoading', function () {
		if (this.get('discussionEditor.shouldStopLoading') === true) {
			this.set('isLoading', false);
			this.set('discussionEditor.shouldStopLoading', false);
		}
	}),

	/**
	 * @returns {void}
	 */
	init(...params) {
		const discussionEditorService = this.get('discussionEditor');

		this._super(...params);
		discussionEditorService.setProperties({
			isAnon: !this.get('currentUser.isAuthenticated'),
			isUserBlocked: this.get('model.isRequesterBlocked')
		});

		discussionEditorService.toggleEditor(false);
	},

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 * @returns {void}
	 */
	style: Ember.computed('isSticky', function () {
		return this.get('isSticky') === true ?
			`height: ${this.$('.editor-container').outerHeight(true)}px` :
			null;
	}),

	/**
	 * @returns {void}
	 */
	onScroll() {
		Ember.run.throttle(
			this,
			function () {
				if (!this.get('isSticky') && this.isStickyBreakpointHeight()) {
					this.set('isSticky', true);
				} else if (this.get('isSticky') && !this.isStickyBreakpointHeight()) {
					this.set('isSticky', false);
				}
			},
			25
		);
	},

	/**
	 * Method should be overwritten in the child classes
	 * @returns {void}
	 * @throws {Error} if method is not overridden in the descendant class
	 */
	isStickyBreakpointHeight() {
		throw new Error('Please, override this method in the descendant class');
	},

	/**
	 * Method should be overwritten in the child classes
	 * @returns {void}
	 * @throws {Error} if method is not overridden in the descendant class
	 */
	initializeStickyState() {
		throw new Error('Please, override this method in the descendant class');
	},

	/**
	 * Ultra hack for editor on iOS
	 * iOS is scrolling on textarea focus, changing it's size on focus prevent that
	 * @returns {void}
	 */
	handleIOSFocus() {},

	/**
	 * Check if user is using iOS browser
	 * @returns {boolean}
	 */
	isIOSBrowser() {
		return (/iPad|iPhone|iPod/).test(navigator.platform);
	},

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click() {
		// This next is needed for iOS
		Ember.run.next(this, () => {
			this.get('discussionEditor').toggleEditor(true);
		});
	},

	/**
	 * Perform animations and logic after post creation
	 * @param {object} newItem
	 * @returns {void}
	 */
	handleNewItemCreated(newItem) {
		this.setProperties({
			isLoading: false,
			showSuccess: true
		});

		Ember.set(newItem, 'isVisible', false);

		Ember.run.later(this, () => {
			this.showNewPostAnimations(newItem);
		}, 2000);
	},

	/**
	 * @param {object} newItem
	 * @returns {void}
	 */
	showNewPostAnimations(newItem) {
		this.setProperties({
			bodyText: '',
			showSuccess: false
		});

		this.get('discussionEditor').toggleEditor(false);

		Ember.set(newItem, 'isVisible', true);

		Ember.run.scheduleOnce('afterRender', this, () => {
			// This needs to be dalayed for CSS animation
			Ember.set(newItem, 'isNew', false);
		});
	},

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this._super(...arguments);

		this.handleIOSFocus();
		this.initializeStickyState();
	},

	/**
	 * Turn off scroll handler on view leave
	 * @returns {void}
	 */
	willDestroyElement() {
		Ember.$(window).off('scroll.editor');
	},

	/**
	 * Removes focus from editor textarea.
	 * @returns {void}
	 */
	textareaBlur() {
		this.$('.editor-textarea').blur();
	},

	/**
	 * Allows setting iOS-specific styles to compensate for Safari's restrictions
	 * @param {object} styles - style object to pass to jQuery
	 * @returns {void}
	 */
	setiOSSpecificStyles(styles) {
		if (this.isIOSBrowser()) {
			Ember.$('html, body').css(styles);
		}
	},

	/**
	 * Calls what's needs to be done after editor is closed
	 * @returns {void}
	 */
	afterCloseActions() {
		this.set('isActive', false);
		this.setiOSSpecificStyles({
			height: '',
			overflow: ''
		});
		this.textareaBlur();
	},

	/**
	 * Calls what's needs to be done after editor is opened
	 * @returns {void}
	 */
	afterOpenActions() {
		this.set('isActive', true);

		// We need this to be sure the transition of the editor has been completed
		// before we're able to apply special styles for iOS and focus the textarea
		Ember.run.next(this, () => {
			this.setiOSSpecificStyles({
				height: '100%',
				overflow: 'hidden'
			});
			this.$('.editor-textarea').focus();
		});
	},

	actions: {
		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		submit() {
			if (!this.get('submitDisabled')) {
				this.set('isLoading', true);

				if (this.get('isEdit')) {
					const action = this.get('discussionEditor.discussionEntity.isReply') ? 'editReply' : 'editPost';

					this.attrs[action]({
						body: this.get('bodyText'),
						id: this.get('discussionEditor.discussionEntity.id')
					});
				} else {
					this.attrs.create({
						body: this.get('bodyText'),
						creatorId: this.get('currentUser.userId'),
						siteId: Mercury.wiki.id
					});
				}
			}
		},

		/**
		 * Enable/disable editor
		 * @param {boolean} active
		 * @returns {void}
		 */
		toggleEditorActive(active) {
			this.get('discussionEditor').toggleEditor(active);
		},

		/**
		 * Handle keypress - post creation shortcut
		 * @param {Event} event
		 * @returns {void}
		 */
		handleKeyPress(event) {
			if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('submit');
			}
		},

		/**
		 * Triggers on textarea's focus
		 * @param {Event} event
		 * @returns {void}
		 */
		onFocus(event) {
			event.preventDefault();
			this.send('toggleEditorActive', true);
		}
	}
});
