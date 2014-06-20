/// <reference path="../app.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />

interface Response {
	payload: {
		article: string
	};
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
			.then((response: Response) => {
				this.loadData(response.payload.article, response.articleDetails);
			},
			// TODO: handle errors
			() => { return; }
			);
	},

	fetchFromPreload() {
		var articleMeta = Wikia.article,
			articleContent = $('.article-content').html();
		this.loadData(articleContent, articleMeta);
	},

	loadData(content: string, meta: {articleDetails: any, relatedPages: any, userDetails: any}) {
		this.set('article', content);
		this.set('comments', meta.articleDetails.comments);
		this.set('id', meta.articleDetails.id);
		this.set('namespace', meta.articleDetails.ns);
		this.set('cleanTitle', meta.articleDetails.title);
		this.set('relatedPages', meta.relatedPages.items[meta.articleDetails.id]);
		this.set('users', meta.userDetails.items);
	}

});
