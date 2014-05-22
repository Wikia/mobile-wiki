/// <reference path="../app.ts" />

interface Response {
	payload: string;
	params: { articleTitle: string; };
}

App.WikiArticleModel = Ember.Object.extend({
	sections: [],
	title: '',
	cleanTitle: '',
	wiki: '',
	article: '',
	users: [],

	titleChanged: function () {
		Ember.$.getJSON('/article/' + this.get('wiki') + '/' + this.get('title'))
			.then((response) => {
				this.set('article', response.payload);

				this.set('lastEdited', Math.floor((Date.now() - new Date(response.articleDetails.revision.timestamp*1000).getTime())/1000/60/60/24/7));
				this.set('comments', response.articleDetails.comments);
				this.set('id', response.articleDetails.id);
				this.set('namespace', response.articleDetails.ns);
				this.set('cleanTitle', response.articleDetails.title);
				this.set('relatedPages', response.relatedPages.items[response.articleDetails.id]);
				this.set('users', response.userDetails.items);
			});
	}.observes('title').on('init')
});
