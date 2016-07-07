import Ember from 'ember';

export default Ember.Component.extend({
	/**
	 * @constant
	 * @private
	 */
	defaultLinkClasses: 'side-button back-button',
	/**
	 * @constant
	 * @private
	 */
	themeLinkClasses: 'side-button back-button active-element-theme-color',
	/**
	 * @constant
	 * @private
	 */
	defaultArrowClasses: 'icon arrow-left',
	/**
	 * @constant
	 * @private
	 */
	themeArrowClasses: 'icon arrow-left fill-theme-color',

	classNames: ['side-button-wrapper'],

	/**
	 * @property
	 * @default true
	 * @public
	 *
	 * Decides whether theme colors should be used on link and arrow.
	 */
	useThemeColor: true,

	discussionSort: Ember.inject.service(),

	linkClasses: Ember.computed('useThemeColor', function () {
		return this.get('useThemeColor') ? this.get('themeLinkClasses') : this.get('defaultLinkClasses');
	}),

	arrowClasses: Ember.computed('useThemeColor', function () {
		return this.get('useThemeColor') ? this.get('themeArrowClasses') : this.get('defaultArrowClasses');
	}),

	discussionSortBy: Ember.computed('useThemeColor', function() {
		return this.get('useThemeColor') ? null : this.get('discussionSort.sortBy');
	})
});
