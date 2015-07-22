/// <reference path="../app.ts" />
'use strict';

App.DiscussionForumPostController = Em.Controller.extend({
	vertical: Em.computed(function (): string { return Mercury.wiki.vertical; })
});
