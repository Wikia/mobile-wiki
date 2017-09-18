import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const {
	Object: EmberObject,
	Service
} = Ember;

const model = EmberObject.create({
	url: '/wiki/Kermit',
	description: 'Article about Kermit',
	displayTitle: 'Kermit The Frog',
	htmlTitle: 'Kermit The Frog'
});

const isInitialPageViewStub = sinon.stub();
const initialPageViewStub = Service.extend({
	isInitialPageView: isInitialPageViewStub
});

moduleFor('route:wikiPage', 'Unit | Route | wiki page', {
	needs: [
		'service:ads',
		'service:currentUser',
		'service:fastboot',
		'service:initial-page-view',
		'service:liftigniter',
		'service:i18n',
		'service:logger',
		'service:router-scroll',
		'service:scheduler',
		'service:wiki-variables',
		'service:head-data'
	],
	beforeEach() {
		window.wgNow = null;
		this.register('service:initial-page-view', initialPageViewStub);
		this.inject.service('initial-page-view', {as: 'initial-page-view'});
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
		headData: EmberObject.create(),
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
		headData: EmberObject.create(),
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
				model: EmberObject.create({
					ns: 0
				})
			},
			{
				expectedHandler: {
					viewName: 'article',
					controllerName: 'article'
				},
				model: EmberObject.create({
					ns: 112
				})
			},
			{
				expectedHandler: {
					viewName: 'category',
					controllerName: 'category'
				},
				model: EmberObject.create({
					ns: 14
				})
			},
			{
				expectedHandler: null,
				model: EmberObject.create({
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
	isInitialPageViewStub.returns(false);

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

	isInitialPageViewStub.reset();
});
