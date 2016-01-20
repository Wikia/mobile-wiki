import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-contributors'],

	contributors: [],

	maxContributorDisplayCount: 7,

	totalContributorCount: 0,

	latestContributors: Ember.computed('contributors', function () {
		const max = this.get('maxContributorDisplayCount');

		return this.get('contributors').slice(0, max);
	}),

	additionalContributorCount: Ember.computed('latestContributors', 'totalContributorCount', function () {
		return this.get('totalContributorCount') - this.get('latestContributors.length');
	})
});
