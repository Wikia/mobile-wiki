/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteComponentMixin.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

App.DiscussionUpvotePostComponent = Em.Component.extend(
	App.DiscussionUpvoteComponentMixin,
	App.DiscussionUpvoteActionSendMixin
);
