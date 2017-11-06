define('mobile-wiki/models/notifications/contributor', ['exports', 'mobile-wiki/utils/url'], function (exports, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object;


	var DiscussionContributor = EmberObject.extend({
		avatarUrl: null,
		badgePermission: null,
		host: null,
		id: null,
		name: null,
		profileUrl: null
	});

	DiscussionContributor.reopenClass({
		getProfileUrl: function getProfileUrl(name) {
			return (0, _url.buildUrl)({
				namespace: 'User',
				relative: true,
				title: name
			});
		},
		create: function create(ownerInjection, data) {
			var result = null;

			if (data) {
				result = this._super(ownerInjection, {
					avatarUrl: data.avatarUrl,
					badgePermission: data.badgePermission,
					id: data.id,
					name: data.name,
					profileUrl: DiscussionContributor.getProfileUrl(data.name)
				});
			}
			return result;
		}
	});

	exports.default = DiscussionContributor;
});