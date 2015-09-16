/// <reference path="../app.ts" />
'use strict';

App.DiscussionContributorsComponent = Em.Component.extend({
	classNames: ['discussion-contributors'],

	additionalContributorsCount: 0,
	count: 7,
	latestContributors: Em.computed('contributors', function () {
		var limit = this.get('count');
		return this.get('contributors').slice(0, limit);
	})
});
