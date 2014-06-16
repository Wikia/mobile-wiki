/// <reference path="../app.ts" />
/// <reference path="../../../typings/i18next/i18next.d.ts" />

interface Response {
	payload: string;
	articleTitle: string;
	articleDetails: {
		revision: {
			timestamp: number;
		};
		comments: any;
		id: number;
		ns: string;
		title: string;
	};
	relatedPages: {
		items: any[];
	};
	userDetails: {
		items: any[];
	};
}

App.WikiArticleModel = Ember.Object.extend({
	sections: [],
	title: '',
	cleanTitle: '',
	wiki: '',
	article: '',
	users: [],
	comments: 0,

	titleChanged: function() {
		if (Wikia._state.firstPage) {
			this.fetchFromPreload();
			Wikia._state.firstPage = false;
		} else {
			this.fetch();
		}
	}.observes('title').on('init'),

	fetch() {
		Ember.$.getJSON('/article/' + this.get('wiki') + '/' + this.get('title'))
			.then(
			(response: Response) => {
				this.set('article', response.payload);
				this.set('comments', response.articleDetails.comments);
				this.set('id', response.articleDetails.id);
				this.set('namespace', response.articleDetails.ns);
				this.set('cleanTitle', response.articleDetails.title);
				this.set('relatedPages', response.relatedPages.items[response.articleDetails.id]);
				this.set('users', response.userDetails.items);
			},
			// TODO: handle errors
			() => { return; }
			);
	},

	fetchFromPreload() {
		var articleMeta = Wikia.article,
			articleContent = $('.article-content').html();

		this.set('article', articleContent);
		this.set('comments', articleMeta.articleDetails.comments);
		this.set('id', articleMeta.articleDetails.id);
		this.set('namespace', articleMeta.articleDetails.ns);
		this.set('cleanTitle', articleMeta.articleDetails.title);
		this.set('relatedPages', articleMeta.relatedPages.items[articleMeta.articleDetails.id]);
		this.set('users', articleMeta.userDetails.items);
	}

});
