import Ember from 'ember';

export default Ember.Component.extend({
	discussionSeoUrlBuilder: Ember.inject.service(),

	nextUrl: Ember.computed('page', function () {
		return this.get('discussionSeoUrlBuilder').nextPageUrl(this.get('totalPosts'));
	}),

	prevUrl: Ember.computed('page', function () {
		return this.get('discussionSeoUrlBuilder').prevPageUrl();
	}),

	firstPageUrl: Ember.computed(function () {
		return this.get('discussionSeoUrlBuilder').firstPageUrl();
	})

});
