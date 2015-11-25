/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend(App.ViewportMixin, {
	attributeBindings: ['style'],

	classNames: ['discussion-editor'],
	classNameBindings: ['isActive', 'hasError'],

	isActive: false,
	isSticky: false,

	submitDisabled: Em.computed('bodyText', 'currentUser.userId', function(): boolean {
		return this.get('bodyText').length === 0 || this.get('currentUser.userId') === null
	}),
	isLoading: false,
	showSuccess: false,
	hasError: false,

	offsetTop: 0,
	siteHeadHeight: 0,

	bodyText: '',
	errorMessage: Em.computed.oneWay('requestErrorMessage'),
	layoutName: 'components/discussion-editor',

	/**
	 * @returns {void}
	 */
	init(): void {
		this._super.apply(this, arguments);

		this.set('isActive', false);
	},

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 * @returns {void}
	 */
	style: Em.computed('isSticky', function (): string {
		return this.get('isSticky') === true
			? `height: ${this.$('.editor-container').outerHeight(true) + this.$('.editor-label').outerHeight()}px`
			: null;
	}),

	onScroll(): void {
		Em.run.throttle(
			this,
			function (): void {
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
	 */
	isStickyBreakpointHeight(): void {
		throw new Error('Please, override this method in the descendant class');
	},

	/**
	 * Method should be overwritten in the child classes
	 * @returns {void}
	 */
	initializeStickyState(): void {
		throw new Error('Please, override this method in the descendant class');
	},

	/**
	 * Display error message on post failure
	 */
	errorMessageObserver: Em.observer('errorMessage', function(): void {
		if (this.get('errorMessage')) {
			alert(i18n.t(this.get('errorMessage'), {ns: 'discussion'}));
		}
		this.set('isLoading', false);
	}),

	/**
	 * Ultra hack for editor on iOS
	 * iOS is scrolling on textarea focus, changing it's size on focus prevent that
	 */
	handleIOSFocus(): void {
		if (/iPad|iPhone|iPod/.test(navigator.platform)) {

			var $editorTextarea = $('.editor-textarea');
			$editorTextarea
				.css('height', '100px')
				.on('focus', function() {
					setTimeout(function(){
						$editorTextarea.css('height', '100%');
					}, 500);
				})
				.on('blur', function() {
					$editorTextarea.css('height', '100px');
				});
		}
	},

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click(): void {
		this.$('.editor-textarea').focus();
	},

	/**
	 * Handle message for anon when activating editor
	 */
	isActiveObserver: Em.observer('isActive', function(): void {
		if (this.get('isActive')) {
			if (this.get('currentUser.userId') === null) {
				this.setProperties({
					isActive: false,
					errorMessage: 'editor.post-error-anon-cant-post'
				});
			}

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
	 * @returns {void}
	 */
	handleNewItemCreated(newItem: any): void {
		this.setProperties({
			isLoading: false,
			showSuccess: true
		});

		Em.set(newItem, 'isVisible', false);

		Em.run.later(this, () => {
			this.showNewPostAnimations(newItem);
		}, 2000);
	},

	showNewPostAnimations(newItem: any): void {
		this.setProperties({
			isActive: false,
			bodyText: '',
			showSuccess: false
		});

		Em.set(newItem, 'isVisible', true);

		Ember.run.scheduleOnce('afterRender', this, () => {
			// This needs to be dalayed for CSS animation
			Em.set(newItem, 'isNew', false);
		});
	},

	/**
	 * @returns {void}
	 */
	didInsertElement(): void {
		this._super();

		this.handleIOSFocus();
		this.initializeStickyState();
	},

	actions: {
		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		create(): void {
			if (!this.get('submitDisabled')) {
				this.set('isLoading', true);

				this.sendAction('create', {
					body: this.get('bodyText'),
					creatorId: this.get('currentUser.userId'),
					siteId: Mercury.wiki.id,
				});
			}
		},

		/**
		 * Enable/disable editor
		 * @returns {void}
		 */
		toggleEditorActive(active: boolean): void {
			this.set('isActive', active);
		},

		/**
		 * Update editor when typing - activate editor
		 * @returns {void}
		 */
		updateOnInput(): void {
			this.set('isActive', true);
		},

		/**
		 * Handle keypress - post creation shortcut
		 * @returns {void}
		 */
		handleKeyPress(event: KeyboardEvent) :void {
			if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('create');
			}
		}
	}
});
