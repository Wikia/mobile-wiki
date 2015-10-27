/// <reference path="../app.ts" />
'use strict';

App.DiscussionContributorsComponent = Em.Component.extend({
	classNames: ['discussion-contributors'],

	contributors: [],

	maxContributorDisplayCount: 7,

	totalContributorCount: 0,

	latestContributors: Em.computed('contributors', function () {
		var max = this.get('maxContributorDisplayCount');
		return this.get('contributors').slice(0, max);
	}),

	additionalContributorCount: Em.computed('latestContributors', 'totalContributorCount', function () {
		return this.get('totalContributorCount') - this.get('latestContributors.length')
	})
});
