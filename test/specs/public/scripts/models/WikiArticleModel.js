// TODO: test on many inputs and ensure inputs are in realistic format?

moduleFor('model:wikiArticle', 'Wiki Article Model', {
	// Preload data into the Wikia object
	setup: function () {
		// Test data for fetchFromPreload
		this.exampleArticleID = 123;
		this.sampleArticleInfo = Ember.Object.create({
			// Written into document in startEmberApp.js already
			contents: 'Test content',
			comments: ['one', 'two', 'three'],
			id: this.exampleArticleID,
			namespace: 'sample namespace',
			title: 'sample title',
			relatedPagesItems: [],
			userItems: []
		});
		this.sampleArticleInfo.get('relatedPagesItems')[this.exampleArticleID] = ['one','two','three'];

		Wikia._state = {};
		Wikia._state.firstPage = true;
		Wikia.article = {};
		Wikia.article.articleDetails = {};
		Wikia.article.relatedPages = {};
		Wikia.article.userDetails = {};
		Wikia.article.articleDetails.comments = this.sampleArticleInfo.get('comments');
		Wikia.article.articleDetails.id = this.sampleArticleInfo.get('id');
		Wikia.article.articleDetails.ns = this.sampleArticleInfo.get('namespace');
		Wikia.article.articleDetails.title = this.sampleArticleInfo.get('title');
		Wikia.article.relatedPages.items = this.sampleArticleInfo.get('relatedPagesItems');
		Wikia.article.userDetails.items = this.sampleArticleInfo.get('userItems');
	},
	teardown: function () {
		App.reset();
		// Resets the Wikia object, basically the same as startWikiaBaseline.js
		Wikia.provide('_state.firstPage', true);
		Wikia.provide('article.articleDetails.comments', {});
		Wikia.provide('article.articleDetails.id', 0);
		Wikia.provide('article.articleDetails.ns', {});
		Wikia.provide('article.articleDetails.title', {});
		Wikia.provide('article.relatedPages.items', []);
		Wikia.provide('article.userDetails.items', []);
	}
});

test('fetchFromPreload', function () {
	var model = this.subject();
	expect(7);
	Ember.run(function () {
		model.fetchFromPreload();
	});
	equal(model.get('article'), this.sampleArticleInfo.contents, 'correctly ingested sample content');
	equal(model.get('comments'), this.sampleArticleInfo.comments, 'correctly ingested comments');
	equal(model.get('id'), this.sampleArticleInfo.id, 'correctly ingested id');
	equal(model.get('namespace'), this.sampleArticleInfo.namespace, 'correctly ingested namespace');
	equal(model.get('cleanTitle'), this.sampleArticleInfo.title, 'correctly ingested title');
	equal(model.get('relatedPages'),
		  this.sampleArticleInfo.relatedPagesItems[this.exampleArticleID],
		  'correction ingested related pages');
	equal(model.users, this.sampleArticleInfo.userItems, 'correctly ingested user items');
});



// Doesn't quite work with the current setup -- maybe come back to it later.
// test('fetch valid page', function () {
// 	expect(7);
// 	var model = this.subject();
// 	var expected = Ember.Object.create();
//  Ember.run(function () {
// 		return Ember.$.getJSON('http://localhost:8000/article/lastofus/Ellie')
// 			.then(
// 				function (response) {
// 					expected.set('article', response.payload);
// 					expected.set('comments', response.articleDetails.comments);
// 					expected.set('id', response.articleDetails.id);
// 					// alert('within helper, id=' + expected.get('id'));
// 					expected.set('namespace', response.articleDetails.ns);
// 					expected.set('cleanTitle', response.articleDetails.title);
// 					expected.set('relatedPages',
// 						response.relatedPages.items[response.articleDetails.id]);
// 					expected.set('users', response.userDetails.items);
// 				},
// 				function () { alert('failed to load lastofus:Ellie'); }
// 			);
// 			model.set('wiki', 'lastofus');
// 			model.set('title', 'Ellie');
// 			model.fetch();
// 		});
// // 	wait(3000);
// 	andThen(function () {
// 		alert('after the helper, id=' + expected.get('id'));
// 		equal(model.get('article'), expected.get('article'), 'article loaded correctly');
// 		equal(model.get('comments'), expected.get('comments'), 'comements loaded correctly');
// 		equal(model.get('id'), expected.get('id'), 'expected id ' + expected.get('id') + ' but got ' + model.get('id'));
// 		equal(model.get('namespace'), expected.get('namespace'), 'namespace loaded correctly');
// 		equal(model.get('cleanTitle'), expected.get('cleanTitle'), 'expected title ');
// 		equal(model.get('relatedPages'), expected.get('relatedPages'), 'users loaded correctly');
// 		equal(model.get('users'), expected.get('users'), 'related pages loaded correctly');
// 	});
// });

/* Code can't yet handle this, and we haven't defined behavior for visiting an invalid article
test('fetch invalid page', function () {

});
*/
