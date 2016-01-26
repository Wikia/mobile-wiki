import Ember from 'ember';
import HeadroomMixin from '../mixins/headroom';

export default Ember.Component.extend(
	HeadroomMixin,
	{
		classNames: ['discussion-header', 'background-theme-color'],

		discussionEditor: Ember.inject.service(),
		discussionSort: Ember.inject.service(),

		overlayIsVisible: Ember.computed.oneWay('discussionSort.sortVisible'),

		siteName: Ember.computed(() => {
			return Ember.get(Mercury, 'wiki.siteName');
		}),
		sortMessageKey: Ember.computed.oneWay('discussionSort.sortMessageKey'),

		actions: {
			/**
			 * @returns {void}
			 */
			showSortComponent() {
				this.get('discussionSort').showSortComponent();
			},

			/**
			 * @returns {void}
			 */
			hideSortComponent() {
				this.get('discussionSort').hideSortComponent();
			},

			toggleEditor(active) {
				this.get('discussionEditor').toggleEditor(active);
			}
		},
	}
);
