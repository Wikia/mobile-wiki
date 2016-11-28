import Ember from 'ember';

export default Ember.Component.extend({
	discussionSeoUrlBuilder: Ember.inject.service(),

	nextUrl: Ember.computed('page', function () {
		return this.get('discussionSeoUrlBuilder').getNextPageUrl(this.get('totalPosts'));
	}),

	prevUrl: Ember.computed('page', function () {
		return this.get('discussionSeoUrlBuilder').getPrevPageUrl();
	}),

	firstPageUrl: Ember.computed(function () {
		return this.get('discussionSeoUrlBuilder').getFirstPageUrl();
	})

});
