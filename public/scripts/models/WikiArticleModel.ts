/// <reference path="../app.ts" />
/// <reference path="../../../definitions/i18next/i18next.d.ts" />

interface Response {
	payload: string;
	params: { articleTitle: string; };
}

function getTranslation(data:any):any {
	var defer = $.Deferred(),
		language = data.lang;
	if (language !== currentLanguage) {
		i18n.setLng(language, function() {
			currentLanguage = language;
			defer.resolve(data);
		});
	} else {
		defer.resolve(data);
	}
	return defer.promise();
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
			.pipe(getTranslation)
			.pipe((response) => {
				this.refresh();
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
