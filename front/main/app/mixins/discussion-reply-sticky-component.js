import Ember from 'ember';

export default Ember.Mixin.create({
	attributeBindings: ['style'],

	classNameBindings: ['isSticky'],

	containerClassname: null,

	isSticky: false,

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 *
	 * @returns {void}
	 */
	style: Ember.computed('isSticky', function () {
		return this.get('isSticky') ?
			`height: ${this.$(this.get('containerClassname')).outerHeight(true)}px` :
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

		Ember.$(window).on('scroll.editor', () => {
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
	viewportChangeObserver: Ember.observer('viewportDimensions.width', 'viewportDimensions.height',
		function () {
			Ember.$(window).off('scroll.editor');
			this.initializeStickyState();
		}
	),

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
	 * Turn off scroll handler on view leave
	 *
	 * @returns {void}
	 */
	willDestroyElement() {
		Ember.$(window).off('scroll.editor');
	},
});
