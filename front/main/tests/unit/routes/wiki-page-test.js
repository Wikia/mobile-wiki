import {test, moduleFor} from 'ember-qunit';

const originalMercury = Ember.$.extend(true, {}, window.Mercury),
	model = Ember.Object.create({
		url: '/wiki/Kermit',
		description: 'Article about Kermit',
		displayTitle: 'Kermit The Frog',
		documentTitle: 'Kermit The Frog'
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
		expectedHeadTags = {
			canonical: 'http://muppet.wikia.com/wiki/Kermit',
			description: 'Article about Kermit',
			documentTitle: 'Kermit The Frog | Muppet Wiki | Fandom powered by Wikia',
			appleItunesApp: 'app-id=1234, app-argument=http://muppet.wikia.com/wiki/Kermit',
			robots: 'index,follow'
		};

	let headData;

	mock.setProperties({
		removeServerTags: Ember.K,
		setStaticHeadTags: Ember.K,
		headData: Ember.Object.create()
	});

	mock.setDynamicHeadTags(model);
	headData = mock.get('headData');

	assert.equal(headData.canonical, expectedHeadTags.canonical);
	assert.equal(headData.description, expectedHeadTags.description);
	assert.equal(headData.appleItunesApp, expectedHeadTags.appleItunesApp);
	assert.equal(headData.robots, expectedHeadTags.robots);
	assert.equal(headData.documentTitle, expectedHeadTags.documentTitle);
});

test('set head tags without apple-itunes-app when appId is not set', function (assert) {
	const mock = this.subject(),
		expectedAppleItunesApp = '';

	let headData;

	delete window.Mercury.wiki.smartBanner;

	mock.setProperties({
		removeServerTags: Ember.K,
		setStaticHeadTags: Ember.K,
		headData: Ember.Object.create()
	});

	mock.setDynamicHeadTags(model);
	headData = mock.get('headData');

	assert.equal(headData.appleItunesApp, expectedAppleItunesApp);
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
