import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

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

	/**
	 * @property
	 * @default false
	 * @public
	 *
	 * Adds sort by query param to link.
	 */
	addSortByQueryParam: false,

	discussionSort: Ember.inject.service(),

	linkClasses: Ember.computed('useThemeColor', function () {
		return this.get('useThemeColor') ? this.get('themeLinkClasses') : this.get('defaultLinkClasses');
	}),

	arrowClasses: Ember.computed('useThemeColor', function () {
		return this.get('useThemeColor') ? this.get('themeArrowClasses') : this.get('defaultArrowClasses');
	}),

	discussionSortBy: Ember.computed('addSortByQueryParam', function () {
		return this.get('addSortByQueryParam') ? this.get('discussionSort.sortBy') : null;
	}),

	actions: {
		clickSideButton() {
			track(trackActions.SideButtonClicked);
		}
	}
});
