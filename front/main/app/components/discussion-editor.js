import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(ViewportMixin, {
	attributeBindings: ['style'],

	classNames: ['discussion-editor'],
	classNameBindings: ['isActive', 'showsOpenGraphCard:has-open-graph'],

	currentUser: Ember.inject.service(),
	discussionEditor: Ember.inject.service(),

	isActive: false,
	isSticky: false,
	isOpenGraphLoading: false,

	showSuccess: false,

	offsetTop: 0,

	showsOpenGraphCard: false,

	siteHeadHeight: 0,

	bodyText: '',
	contentLength: 0,
	errorMessage: Ember.computed.alias('discussionEditor.errorMessage'),

	layoutName: 'components/discussion-editor',
	// Tracking action name of closing the editor
	closeTrackingAction: trackActions.PostClose,
	// Tracking action name of inserting content into editor
	contentTrackingAction: trackActions.PostContent,
	// Tracking action name of opening the editor
	startTrackingAction: trackActions.PostStart,
	wasContentTracked: false,
	wasStartTracked: false,

	/**
	 * @returns {boolean}
	 */
	submitDisabled: Ember.computed('bodyText', 'currentUser.userId', function () {
		return this.get('bodyText').length === 0 || this.get('currentUser.userId') === null;
	}),

	/**
	 * Track content changed
	 *
	 * @returns {void}
	 */
	onTextContent: Ember.observer('bodyText', function () {
		if (this.get('contentLength') > 0 && !this.get('wasContentTracked')) {
			this.trackContentAction();
		}

		this.handleOG();

		this.set('contentLength', this.get('bodyText').length);
	}),

	/**
	 * Generates OG card if there's a url to generate it for
	 *
	 * @returns {void}
	 */
	handleOG() {
		const textarea = this.$('textarea')[0],
			value = textarea.value,
			lastChar = value.charCodeAt(textarea.selectionEnd - 1);

		if ((lastChar !== 10 && lastChar !== 13 && lastChar !== 32) || (value.length <= this.get('contentLength'))) {
			return;
		}

		const url = this.getLastUrlFromText(value.substring(0, textarea.selectionEnd));

		// start with position of caret - url length - 1 for newly typed charatcter
		if (url && value.indexOf(url) === textarea.selectionEnd - url.length - 1) {
			this.setOpenGraphProperties(url);
		}
	},

	setOpenGraphProperties(url) {
		if (this.get('showsOpenGraphCard')) {
			return;
		}

		this.setProperties({
			isOpenGraphLoading: true,
			showsOpenGraphCard: true
		});

		this.get('generateOpenGraph')(url)
			.then((openGraph) => {
				this.setProperties({
					openGraphUrl: url,
					openGraph,
					isOpenGraphLoading: false,
				});

				track(trackActions.OGCreated);
			}).catch(() => {
				this.setProperties({
					openGraph: null,
					isOpenGraphLoading: false,
					showsOpenGraphCard: false,
				});
			});
	},

	/**
	 * @returns {void}
	 */
	trackContentAction() {
		track(this.get('contentTrackingAction'));
		this.set('wasContentTracked', true);
	},

	/**
	 * Handle hiding error message
	 *
	 * @returns {void}
	 */
	onErrorMessage: Ember.observer('errorMessage', function () {
		if (this.get('errorMessage')) {
			Ember.run.later(this, () => {
				this.get('discussionEditor').setErrorMessage(null);
			}, 3000);
		}
	}),

	/**
	 * Handle opening/closing editor
	 *
	 * @returns {void}
	 */
	editorServiceStateObserver: Ember.observer('discussionEditor.isEditorOpen', function () {
		if (this.get('discussionEditor.isEditorOpen')) {
			this.afterOpenActions();
		} else {
			this.afterCloseActions();
		}
	}),

	/**
	 * Reacts on new item creation failure in the model by stopping the throbber
	 *
	 * @returns {void}
	 */
	isLoading: Ember.computed.alias('discussionEditor.isLoading'),

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
	 *
	 * @returns {void}
	 */
	style: Ember.computed('isSticky', function () {
		return this.get('isSticky') ?
			`height: ${this.$('.editor-container').outerHeight(true) + this.$('.editor-label').outerHeight()}px` :
			null;
	}),

	/**
	 * @returns {void}
	 */
	onScroll() {
		Ember.run.throttle(
			this,
			function () {
				// we can't change it to
				// this.set('isSticky', !this.get('isSticky') && this.isStickyBreakpointHeight())
				// because it is important to fire the set method only when it's necessary, because there is observer
				// that watches isSticky changes (and it is fired on every set)
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
	 *
	 * @returns {void}
	 *
	 * @throws {Error} if method is not overridden in the descendant class
	 */
	isStickyBreakpointHeight() {
		throw new Error('Please, override this method in the descendant class');
	},

	/**
	 * Method should be overwritten in the child classes
	 *
	 * @returns {void}
	 *
	 * @throws {Error} if method is not overridden in the descendant class
	 */
	initializeStickyState() {
		throw new Error('Please, override this method in the descendant class');
	},

	/**
	 * Check if user is using iOS browser
	 *
	 * @returns {boolean}
	 */
	isIOSBrowser() {
		return (/iPad|iPhone|iPod/).test(navigator.platform);
	},

	/**
	 * Handle clicks - focus in textarea and activate editor
	 *
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
	 *
	 * @param {object} newItem
	 *
	 * @returns {void}
	 */
	handleNewItemCreated(newItem) {
		this.set('showSuccess', true);

		Ember.set(newItem, 'isVisible', false);

		Ember.run.later(this, () => {
			this.showNewPostAnimations(newItem);
		}, 2000);
	},

	getLastUrlFromText(text) {
		let urls;

		urls = text.match(/(https?:\/\/[^\s]+)/g);

		if (!urls) {
			return null;
		}

		return urls.pop();
	},

	/**
	 * @param {object} newItem
	 *
	 * @returns {void}
	 */
	showNewPostAnimations(newItem) {
		this.setProperties({
			bodyText: '',
			showsOpenGraphCard: false,
			openGraph: null,
			showSuccess: false,
		});

		this.get('discussionEditor').toggleEditor(false);
		this.resetSize();

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
		this.initializePasting();
		this.initializeStickyState();
		this.initializeSizing();
	},

	initializePasting() {
		this.$().find('textarea')
			.on('paste', this.onPaste.bind(this));
	},

	/**
	 * In some browsers (IE11) there's no support for event clipboard data, so there's a need to
	 * wait and then check the content of the textarea
	 *
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onPaste(event) {
		const clipboardData = Ember.get(event, 'originalEvent.clipboardData'),
			textType = 'text/plain';

		let pastedText;

		if (clipboardData && clipboardData.getData &&
			Array.prototype.slice.call(clipboardData.types).indexOf(textType) !== -1) {
			pastedText = clipboardData.getData(textType);
		}

		if (typeof pastedText === 'string' && pastedText.length) {
			this.setOpenGraphProperties(this.getLastUrlFromText(pastedText));
		} else {
			Ember.run.later(() => {
				const textarea = event.target;

				this.setOpenGraphProperties(this.getLastUrlFromText(
					textarea.value.substring(0, textarea.selectionEnd)
				));
			}, 100);
		}
	},

	/**
	 * Sets the size of textarea whenever there's a change to it's state
	 * It is invoked in the context of a textarea object (this)
	 *
	 * @returns {void}
	 */
	initializeSizing() {
		this.$().find('textarea')
			.on('focus', this.setSize)
			.on('input', this.setSize);
	},

	/**
	 * Sets textarea height based on it's scrollHeight
	 *
	 * @returns {void}
	 */
	setSize() {
		this.style.height = '1px';
		this.style.height = `${this.scrollHeight}px`;
	},

	/**
	 * Removes calculated size of textarea
	 *
	 * @returns {void}
	 */
	resetSize() {
		this.$().find('textarea').css('height', '');
	},

	/**
	 * Turn off scroll handler on view leave
	 *
	 * @returns {void}
	 */
	willDestroyElement() {
		Ember.$(window).off('scroll.editor');
	},

	/**
	 * Removes focus from editor textarea
	 *
	 * @returns {void}
	 */
	textareaBlur() {
		this.$('.editor-textarea').blur();
	},

	/**
	 * Allows setting iOS-specific styles to compensate for Safari's restrictions
	 *
	 * @param {object} styles - style object to pass to jQuery
	 *
	 * @returns {void}
	 */
	setiOSSpecificStyles(styles) {
		if (this.isIOSBrowser()) {
			Ember.$('html, body').css(styles);
		}
	},

	/**
	 * Calls what's needs to be done after editor is closed
	 *
	 * @returns {void}
	 */
	afterCloseActions() {
		this.setProperties({
			isActive: false,
			wasContentTracked: false,
			wasStartTracked: false
		});
		this.setiOSSpecificStyles({
			height: '',
			overflow: ''
		});
		this.textareaBlur();
	},

	/**
	 * Calls what's needs to be done after editor is opened
	 *
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
		 *
		 * @returns {void}
		 */
		submit() {
			if (!this.get('submitDisabled')) {
				const newDiscussionEntityData = {
					body: this.get('bodyText'),
					creatorId: this.get('currentUser.userId'),
					siteId: Mercury.wiki.id,
				};

				this.get('discussionEditor').set('isLoading', true);

				if (this.get('showsOpenGraphCard')) {
					newDiscussionEntityData.openGraph = {
						uri: this.get('openGraph.href')
					};
				}

				this.get('create')(newDiscussionEntityData);
			}
		},

		/**
		 * Enable/disable editor
		 *
		 * @param {boolean} active
		 *
		 * @returns {void}
		 */
		toggleEditorActive(active) {
			if (active && !this.get('wasStartTracked')) {
				track(this.get('startTrackingAction'));
				this.set('wasStartTracked', true);
			}

			this.get('discussionEditor').toggleEditor(active);
		},

		/**
		 * Handle keypress - post creation shortcut
		 *
		 * @param {Event} event
		 *
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
		 *
		 * @param {Event} event
		 *
		 * @returns {void}
		 */
		onFocus(event) {
			event.preventDefault();
			this.send('toggleEditorActive', true);
		},

		/**
		 * @returns {void}
		 */
		close() {
			this.send('toggleEditorActive', false);

			track(this.get('closeTrackingAction'));
		},

		/**
		 * Hides open graph card and removes it's data from the editor
		 *
		 * @returns {void}
		 */
		removeOpenGraph() {
			this.setProperties({
				showsOpenGraphCard: false,
				openGraph: null,
			});

			track(trackActions.OGRemoved);
		}
	}
});
