import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-contributors'],

	users: [],

	maxContributorDisplayCount: 7,

	totalContributorCount: 0,

	latestContributors: Ember.computed('users', function () {
		return this.get('users').slice(0, this.get('maxContributorDisplayCount'));
	}),

	additionalContributorCount: Ember.computed('latestContributors', 'totalContributorCount', function () {
		return this.get('totalContributorCount') - this.get('latestContributors.length');
	})
});
