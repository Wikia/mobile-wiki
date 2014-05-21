/// <reference path="../app.ts" />

interface Response {
	payload: string;
	params: { articleTitle: string; };
}

App.WikiArticleModel = Ember.Object.extend({
	sections: [],
	title: '',
	cleanTitle: function(){
		return this.get('title').replace(/_/g, ' ');
	}.property('title'),
	wiki: '',
	article: '',

	titleChanged: function () {
		Ember.$.getJSON('/article/' + this.get('wiki') + '/' + this.get('title'))
			.then((response) => {
				this.set('article', response.payload);
			});
	}.observes('title').on('init')
});
