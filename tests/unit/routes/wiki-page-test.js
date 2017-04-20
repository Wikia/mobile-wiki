import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';

const model = Ember.Object.create({
	url: '/wiki/Kermit',
	description: 'Article about Kermit',
	displayTitle: 'Kermit The Frog',
	htmlTitle: 'Kermit The Frog'
});

moduleFor('route:wikiPage', 'Unit | Route | wiki page', {
	needs: [
		'service:fastboot',
		'service:logger',
		'service:router-scroll',
		'service:wiki-variables'
	],
	beforeEach() {
		window.wgNow = null;
	}
});

test('set head tags for correct model', function (assert) {
	const mock = this.subject(),
		expectedHeadTags = {
			canonical: 'http://muppet.wikia.com/wiki/Kermit',
			description: 'Article about Kermit',
			htmlTitle: 'Kermit The Frog | Muppet Wiki | Fandom powered by Wikia',
			appleItunesApp: 'app-id=1234, app-argument=http://muppet.wikia.com/wiki/Kermit',
			robots: 'index,follow',
			keywords: 'The Fallout wiki - Fallout: New Vegas and more,MediaWiki,fallout,Kermit The Frog'
		};

	let headData;

	mock.setProperties({
		removeServerTags() {},
		setStaticHeadTags() {},
		headData: Ember.Object.create(),
		wikiVariables: {
			basePath: 'http://muppet.wikia.com',
			htmlTitle: {
				parts: ['Muppet Wiki', 'Fandom powered by Wikia'],
				separator: ' | '
			},
			siteMessage: 'The Fallout wiki - Fallout: New Vegas and more',
			siteName: 'MediaWiki',
			dbName: 'fallout',
			specialRobotPolicy: 'index,follow',
			smartBanner: {
				appId: {
					ios: '1234',
				},
			}
		}
	});

	mock.setDynamicHeadTags(model);
	headData = mock.get('headData');

	assert.equal(headData.canonical, expectedHeadTags.canonical);
	assert.equal(headData.description, expectedHeadTags.description);
	assert.equal(headData.appleItunesApp, expectedHeadTags.appleItunesApp);
	assert.equal(headData.robots, expectedHeadTags.robots);
	assert.equal(headData.htmlTitle, expectedHeadTags.htmlTitle);
	assert.equal(headData.keywords, expectedHeadTags.keywords);
});

test('set head tags without apple-itunes-app when appId is not set', function (assert) {
	const mock = this.subject(),
		expectedAppleItunesApp = '';

	let headData;

	mock.setProperties({
		removeServerTags() {},
		setStaticHeadTags() {},
		headData: Ember.Object.create(),
		wikiVariables: {
			basePath: 'http://muppet.wikia.com',
			htmlTitle: {
				parts: ['Muppet Wiki', 'Fandom powered by Wikia'],
				separator: ' | '
			},
			siteMessage: 'The Fallout wiki - Fallout: New Vegas and more',
			siteName: 'MediaWiki',
			dbName: 'fallout',
			specialRobotPolicy: 'index,follow',
		}
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

	mock.set('wikiVariables', {
		contentNamespaces: [0, 112]
	});

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

test('get correct handler based on model isCuratedMainPage', function (assert) {
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
	const stub = sinon.stub(require('mobile-wiki/utils/initial-page-view'), 'default');
	stub.returns(false);

	const mock = this.subject();
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

	stub.restore();
});
