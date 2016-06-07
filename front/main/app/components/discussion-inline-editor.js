
import Ember from 'ember';

import OpenGraph from '../models/discussion/domain/open-graph';

export default Ember.Component.extend({
	attributeBindings: ['style'],
	classNames: ['discussion-inline-editor'],
	classNameBindings: ['isSticky'],

	currentUser: Ember.inject.service(),

	labelMessageKey: 'TODO',
	placeholderMessageKey: 'TODO',
	submitMessageKey: 'TODO',

	content: '',
	openGraph: OpenGraph.create({
		description: 'Some description',
		domain: 'glee.wikia.com',
		exists: true,
		id: 2702253634848394020,
		imageHeight: 348,
		imageUrl: 'http://static.wikia.nocookie.net/41741229-ae55-4879-8b78-7de8ad69061d',
		imageWidth: 464,
		siteId: 26337,
		siteName: '@Wikia',
		title: 'Glee TV Show Wiki',
		type: 'website',
		url: 'http://glee.wikia.com/wiki/Glee_TV_Show_Wiki',
	}),

	isSticky: false,
	submitDisabled: false,
	showSuccess: false,
	isLoading: false,
	showsOpenGraphCard: true,
	isOpenGraphLoading: false,

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
		close() {

		},
		submit() {

		},
		removeOpenGraph() {

		},
		handleKeyPress() {

		}
	}
});
