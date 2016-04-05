import {test, moduleFor} from 'ember-qunit';

const originalMercury = Ember.$.extend(true, {}, window.Mercury),
	model = Ember.Object.create({
		url: '/wiki/Kermit',
		description: 'Article about Kermit',
		displayTitle: 'Kermit The Frog',
		documentTitle: 'Kermit The Frog - Muppet Wiki - Wikia'
	});

moduleFor('route:wikiPage', 'Unit | Route | wiki page', {
	beforeEach() {
		window.wgNow = null;
	},
	afterEach() {
		window.Mercury = Ember.$.extend(true, {}, originalMercury);
	}
});

test('set head tags for correct model', function (assert) {
	const mock = this.subject(),
		expectedHeadTags = [
			{
				type: 'link',
				tagId: 'canonical-url',
				attrs: {
					rel: 'canonical',
					href: 'http://muppet.wikia.com/wiki/Kermit'
				}
			},
			{
				type: 'meta',
				tagId: 'meta-description',
				attrs: {
					name: 'description',
					content: 'Article about Kermit'
				}
			},
			{
				type: 'meta',
				tagId: 'meta-apple-app',
				attrs: {
					name: 'apple-itunes-app',
					content: 'app-id=1234, app-argument=http://muppet.wikia.com/wiki/Kermit'
				}
			}
		];

	mock.setHeadTags(model);

	assert.deepEqual(mock.get('headTags'), expectedHeadTags, 'headTags property is different than expected');
});

test('set head tags without apple-itunes-app when appId is not set', function (assert) {
	const mock = this.subject(),
		expectedHeadTags = [
			{
				type: 'link',
				tagId: 'canonical-url',
				attrs: {
					rel: 'canonical',
					href: 'http://muppet.wikia.com/wiki/Kermit'
				}
			},
			{
				type: 'meta',
				tagId: 'meta-description',
				attrs: {
					name: 'description',
					content: 'Article about Kermit'
				}
			}
		];

	delete window.Mercury.wiki.smartBanner.appId.ios;

	mock.setHeadTags(model);

	assert.deepEqual(mock.get('headTags'), expectedHeadTags, 'headTags property is different than expected');
});

test('set correct document title', function (assert) {
	const mock = this.subject(),
		expectedDocumentTitle = 'Kermit The Frog - Muppet Wiki - Wikia';

	mock.setHeadTags(model);

	assert.equal(document.title, expectedDocumentTitle, 'document title is different than expected');
});

test('get correct handler based on model namespace', function (assert) {
	const mock = this.subject(),
		testCases = [
			{
				expectedHandler: {
					viewName: 'article',
					controllerName: 'article'
				},
				model: Ember.Object.create({
					ns: 0
				})
			},
			{
				expectedHandler: {
					viewName: 'article',
					controllerName: 'article'
				},
				model: Ember.Object.create({
					ns: 112
				})
			},
			{
				expectedHandler: {
					viewName: 'category',
					controllerName: 'category'
				},
				model: Ember.Object.create({
					ns: 14
				})
			},
			{
				expectedHandler: null,
				model: Ember.Object.create({
					ns: 200
				})
			}
		];

	window.Mercury.wiki.contentNamespaces = [0, 112];

	testCases.forEach(({expectedHandler, model}) => {
		const handler = mock.getHandler(model);

		if (handler) {
			assert.equal(handler.viewName, expectedHandler.viewName, 'viewName is different than expected');
			assert.equal(handler.controllerName, expectedHandler.controllerName, 'controllerName is different than expected');
		} else {
			assert.equal(handler, expectedHandler, 'handler is not null');
		}
	});
});

test('get correct handler based on model isMainPage flag and exception', function (assert) {
	const mock = this.subject(),
		expectedHandler = {
			viewName: 'main-page',
			controllerName: 'main-page'
		};

	let handler;

	model.isCuratedMainPage = true;

	handler = mock.getHandler(model);

	assert.equal(handler.viewName, expectedHandler.viewName, 'viewName is different than expected');
	assert.equal(handler.controllerName, expectedHandler.controllerName, 'controllerName is different than expected');
});

test('reset ads variables on before model', function (assert) {
	const mock = this.subject();

	M.prop('initialPageView', false);
	mock.controllerFor = () => {
		return {
			send: () => {}
		};
	};

	mock.beforeModel({
		params: {
			'wiki-page': {
				title: 'foo'
			}
		}
	});

	assert.notEqual(window.wgNow, null);
});
