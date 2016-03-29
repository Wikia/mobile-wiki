import {test, moduleFor} from 'ember-qunit';

const originalMercury = Ember.$.extend(true, {}, window.Mercury),
	model = Ember.Object.create({
		url: '/wiki/Kermit',
		description: 'Article about Kermit',
		displayTitle: 'Kermit The Frog'
	}),
	originalMediaWikiNamespace = M.prop('mediaWikiNamespace');

moduleFor('route:wikiPage', 'Unit | Route | wiki page', {
	afterEach() {
		window.Mercury = Ember.$.extend(true, {}, originalMercury);
		M.prop('mediaWikiNamespace', originalMediaWikiNamespace, true);
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

test('set default document title when htmlTitleTemplate is not set', function (assert) {
	const mock = this.subject(),
		expectedDocumentTitle = 'Kermit The Frog - Wikia';

	delete window.Mercury.wiki.htmlTitleTemplate;

	mock.setHeadTags(model);

	assert.equal(document.title, expectedDocumentTitle, 'document title is different than expected');
});

test('get correct handler based on model namespace', function (assert) {
	const mock = this.subject(),
		testCases = [
			{
				namespace: 0,
				expectedHandler: {
					viewName: 'article',
					controllerName: 'article'
				}
			},
			{
				namespace: 14,
				expectedHandler: {
					viewName: 'category',
					controllerName: 'category'
				}
			},
			{
				namespace: 99,
				expectedHandler: null
			},
			{
				namespace: null,
				expectedHandler: null
			}
		];

	testCases.forEach(({namespace, expectedHandler}) => {
		M.prop('mediaWikiNamespace', namespace, true);

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
