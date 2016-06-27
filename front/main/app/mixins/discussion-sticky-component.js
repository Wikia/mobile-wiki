import Ember from 'ember';

const {Mixin, computed, $, observer, run} = Ember;

export default Mixin.create({
	attributeBindings: ['style'],

	classNameBindings: ['isSticky'],

	// needs to be overrode in classes that extend this mixin
	containerSelector: null,

	isSticky: false,

	onIsActive: Ember.observer('isActive', function () {
		if (this.get('isActive')) {
			this.toggleStickyState();
		}
	}),

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 *
	 * @returns {void}
	 */
	style: computed('isSticky', function () {
		return this.get('isSticky') ?
			`height: ${this.$(this.get('containerSelector')).outerHeight(true)}px` :
			null;
	}),

	didInsertElement() {
		this._super(...arguments);
		this.initializeStickyState();
	},

	/**
	 * Initialize onScroll binding for sticky logic
	 *
	 * @returns {void}
	 */
	initializeStickyState() {
		const scrollY = window.scrollY || window.pageYOffset;

		this.set('isSticky', window.innerHeight + scrollY < this.$().offset().top + this.$().height());

		$(window).on('scroll.editor', () => {
			this.onScroll();
		});
	},

	/**
	 * Indicates if the scroll position reached a point where editor stub should start sticking
	 *
	 * @returns {boolean}
	 */
	isStickyBreakpointHeight() {
		const $element = this.$(),
			scrollY = window.scrollY || window.pageYOffset;

		return window.innerHeight + scrollY < $element.offset().top + $element.outerHeight();
	},

	/**
	 * Handle recalculation of placeholder size on resize
	 *
	 * @returns {void}
	 */
	viewportChangeObserver: observer('viewportDimensions.width', 'viewportDimensions.height',
		function () {
			$(window).off('scroll.editor');
			this.initializeStickyState();
		}
	),

	/**
	 * @returns {void}
	 */
	onScroll() {
		run.throttle(
			this,
			function () {
				this.toggleStickyState();
			},
			25
		);
	},

	/**
	 * @returns {void}
	 */
	toggleStickyState() {
		if (!this.get('isSticky') && this.isStickyBreakpointHeight()) {
			this.set('isSticky', true);
		} else if (this.get('isSticky') && !this.isStickyBreakpointHeight()) {
			this.set('isSticky', false);
		}
	},

	/**
	 * Turn off scroll handler on view leave
	 *
	 * @returns {void}
	 */
	willDestroyElement() {
		$(window).off('scroll.editor');
	},
});
