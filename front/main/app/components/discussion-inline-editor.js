import Ember from 'ember';

import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';


export default Ember.Component.extend(DiscussionEditorOpengraph, {
	attributeBindings: ['style'],
	classNames: ['discussion-inline-editor'],
	classNameBindings: ['isSticky'],

	currentUser: Ember.inject.service(),

	labelMessageKey: 'TODO',
	placeholderMessageKey: 'TODO',
	submitMessageKey: 'TODO',

	content: '',

	isSticky: false,
	submitDisabled: false,
	showSuccess: false,
	isLoading: false,

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 *
	 * @returns {void}
	 */
	style: Ember.computed('isSticky', function () {
		return this.get('isSticky') ?
			Ember.String.htmlSafe(`height: ${this.$('.discussion-inline-editor-wrapper').outerHeight(true)}px`) :
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
	 * Indicates if the scroll position reached a point where editor should start sticking
	 * @returns {boolean}
	 */
	isStickyBreakpointHeight() {
		return window.pageYOffset >= this.get('offsetTop') - this.get('siteHeadHeight');
	},

	didInsertElement() {
		this._super(...arguments);
		this.initializeStickyState();
	},

	willDestroyElement() {
		Ember.$(window).off('scroll.editor', this.onScroll.bind(this));
	},

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState() {
		this.setProperties({
			isSticky: false,
			offsetTop: this.$().offset().top,
			siteHeadHeight: Ember.$('.site-head').outerHeight(true),
		});

		Ember.$(window).on('scroll.editor', this.onScroll.bind(this));
	},

	actions: {
		submit() {

		}
	}
});
