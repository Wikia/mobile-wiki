import App from '../app';
import ViewportMixin from '../mixins/viewport';

export default App.DiscussionEditorComponent = Ember.Component.extend(ViewportMixin, {
	attributeBindings: ['style'],

	classNames: ['discussion-editor'],
	classNameBindings: ['isActive', 'hasError'],

	isActive: false,
	isSticky: false,

	isLoading: false,
	showSuccess: false,
	hasError: false,

	offsetTop: 0,
	siteHeadHeight: 0,

	bodyText: '',
	layoutName: 'components/discussion-editor',

	errorMessage: Ember.computed.oneWay('requestErrorMessage'),

	/**
	 * @returns {boolean}
	 */
	submitDisabled: Ember.computed('bodyText', 'currentUser.userId', function () {
		return this.get('bodyText').length === 0 || this.get('currentUser.userId') === null;
	}),

	/**
	 * @returns {void}
	 */
	init(...params) {
		this._super(...params);
		this.set('isActive', false);

		Ember.$(document).on('click', '.new-post', () => {
			this.actions.toggleEditorActive.call(this, true);
		});
	},

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 * @returns {void}
	 */
	style: Ember.computed('isSticky', function () {
		return this.get('isSticky') === true ?
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
	 * Display error message on post failure
	 */
	errorMessageObserver: Ember.observer('errorMessage', function () {
		if (this.get('errorMessage')) {
			alert(i18n.t(this.get('errorMessage'), {ns: 'discussion'}));
		}
		this.set('isLoading', false);
	}),

	/**
	 * Ultra hack for editor on iOS
	 * iOS is scrolling on textarea focus, changing it's size on focus prevent that
	 * @returns {void}
	 */
	handleIOSFocus() {},

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click() {
		this.$('.editor-textarea').focus();
	},

	/**
	 * Handle message for anon when activating editor
	 */
	isActiveObserver: Ember.observer('isActive', function () {
		if (this.get('isActive')) {
			/*
			 iOS hack for position: fixed - now we display loading icon.
			 */
			if (/iPad|iPhone|iPod/.test(navigator.platform)) {
				$('html, body').css({
					height: '100%',
					overflow: 'hidden'
				});
			}
		} else {
			$('html, body').css({
				height: '',
				overflow: ''
			});
		}
	}),


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
			isActive: false,
			bodyText: '',
			showSuccess: false
		});

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
		this._super();

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

	actions: {
		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		create() {
			if (!this.get('submitDisabled')) {
				this.set('isLoading', true);

				this.sendAction('create', {
					body: this.get('bodyText'),
					creatorId: this.get('currentUser.userId'),
					siteId: Mercury.wiki.id
				});
			}
		},

		/**
		 * Enable/disable editor
		 * @param {boolean} active
		 * @returns {void}
		 */
		toggleEditorActive(active) {

			// do NOT set the editor active under certain rules:
			// 1. user is not logged in
			if (active === true && this.get('currentUser.userId') === null) {
				const errorMessageOld = this.get('errorMessage');

				this.setProperties({
					isActive: false,
					errorMessage: 'editor.post-error-anon-cant-post'
				});

				// to indicate errorMessage observer even if error message is the same as before
				if (errorMessageOld === this.get('errorMessage')) {
					this.notifyPropertyChange('errorMessage');
				}

				this.$('.editor-textarea').blur();

				return;
			}

			this.set('isActive', active);
		},

		/**
		 * Update editor when typing - activate editor
		 * @returns {void}
		 */
		updateOnInput() {
			this.set('isActive', true);
		},

		/**
		 * Handle keypress - post creation shortcut
		 * @param {Event} event
		 * @returns {void}
		 */
		handleKeyPress(event) {
			if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('create');
			}
		}
	}
});
