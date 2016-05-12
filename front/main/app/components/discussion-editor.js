import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';
import {track, trackActions} from '../utils/discussion-tracker';
import OpenGraph from '../models/discussion/domain/open-graph';

export default Ember.Component.extend(ViewportMixin, {
	attributeBindings: ['style'],

	classNames: ['discussion-editor'],
	classNameBindings: ['isActive', 'hasError', 'showsOpenGraphCard:has-open-graph'],

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

	openGraph: OpenGraph.create({
		description: 'Some description',
		domain: 'glee.wikia.com',
		exists: true,
		id: 2702253634848394020,
		imageHeight: 348,
		imageUrl: 'https://i.ytimg.com/vi/ybQ__WdAqvE/hqdefault.jpg',
		imageWidth: 464,
		siteId: 26337,
		siteName: '@Wikia',
		title: 'Glee TV Show Wiki',
		type: 'website',
		url: 'http://glee.wikia.com/wiki/Glee_TV_Show_Wiki',
	}),

	/**
	 * @returns {boolean}
	 */
	submitDisabled: Ember.computed('bodyText', 'currentUser.userId', function () {
		return this.get('bodyText').length === 0 || this.get('currentUser.userId') === null;
	}),

	/**
	 * Track content changed
	 * @returns {void}
	 */
	onTextContent: Ember.observer('bodyText', function () {
		if (this.get('bodyText').length > 0 && !this.get('wasContentTracked')) {
			track(this.get('contentTrackingAction'));
			this.set('wasContentTracked', true);
		}

		this.setOpenGraphProperties(this.get('bodyText'), /(https?:\/\/[^\s]+)\s/g);
	}),

	setOpenGraphProperties(text, urlRegex) {
		if (this.get('showsOpenGraphCard')) {
			return;
		}

		const urls = text.match(urlRegex);

		if (!urls) {
			return;
		}

		this.setProperties({
			isOpenGraphLoading: true,
			showsOpenGraphCard: true
		});

		const url = urls[0].trim();

		this.get('generateOpenGraph')(url.trim())
			.then((openGraph) => {
				this.setProperties({
					openGraphUrl: url.trim(),
					openGraph,
					isOpenGraphLoading: false,
				});
			}).catch(() => {
				this.setProperties({
					openGraph: null,
					isOpenGraphLoading: false,
					showsOpenGraphCard: false
				});
			});
	},

	/**
	 * Handle hiding error message
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
		this.set('showSuccess', true);

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
			showsOpenGraphCard: false,
			showSuccess: false,
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
		this.$().find('textarea').on('paste', this.onPaste);
		this.handleIOSFocus();
		this.initializeStickyState();
	},

	onPaste(event) {
		this.setOpenGraphProperties(event.target.value, /(https?:\/\/[^\s]+)/g);
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
				const newDiscussionEntityData = {
					body: this.get('bodyText'),
					creatorId: this.get('currentUser.userId'),
					siteId: Mercury.wiki.id,
				};

				this.get('discussionEditor').set('isLoading', true);

				if (this.get('showsOpenGraphCard')) {
					newDiscussionEntityData.openGraph = {
						// TODO real URI
						uri: '/3035/opengraph/2742692796107326848'
					};
				}

				this.get('create')(newDiscussionEntityData);
			}
		},

		/**
		 * Enable/disable editor
		 * @param {boolean} active
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
		},

		/**
		 * @returns {void}
		 */
		close() {
			this.send('toggleEditorActive', false);

			track(this.get('closeTrackingAction'));
		},

		removeOpenGraph() {
			this.setProperties({
				showsOpenGraphCard: false,
				openGraph: null,
			});
		}
	}
});
