import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-contributors'],

	contributorsUsers: [],

	maxContributorDisplayCount: 7,

	totalContributorCount: 0,

	latestContributors: Ember.computed('contributorsUsers', function () {
		const max = this.get('maxContributorDisplayCount');

		return this.get('contributorsUsers').slice(0, max);
	}),

	additionalContributorCount: Ember.computed('latestContributors', 'totalContributorCount', function () {
		return this.get('totalContributorCount') - this.get('latestContributors.length');
	})
});
