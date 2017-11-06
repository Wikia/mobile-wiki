define('mobile-wiki/tests/unit/routes/wiki-page-test', ['ember-qunit', 'sinon'], function (_emberQunit, _sinon) {
	'use strict';

	var EmberObject = Ember.Object,
	    Service = Ember.Service;


	var model = EmberObject.create({
		url: '/wiki/Kermit',
		description: 'Article about Kermit',
		displayTitle: 'Kermit The Frog',
		htmlTitle: 'Kermit The Frog'
	});

	var isInitialPageViewStub = _sinon.default.stub();
	var initialPageViewStub = Service.extend({
		isInitialPageView: isInitialPageViewStub
	});

	(0, _emberQunit.moduleFor)('route:wikiPage', 'Unit | Route | wiki page', {
		needs: ['service:ads', 'service:currentUser', 'service:fastboot', 'service:initial-page-view', 'service:liftigniter', 'service:i18n', 'service:logger', 'service:router-scroll', 'service:scheduler', 'service:wiki-variables', 'service:head-data'],
		beforeEach: function beforeEach() {
			window.wgNow = null;
			this.register('service:initial-page-view', initialPageViewStub);
			this.inject.service('initial-page-view', { as: 'initial-page-view' });
		}
	});

	(0, _emberQunit.test)('set head tags for correct model', function (assert) {
		var mock = this.subject(),
		    expectedHeadTags = {
			canonical: 'http://muppet.wikia.com/wiki/Kermit',
			description: 'Article about Kermit',
			htmlTitle: 'Kermit The Frog | Muppet Wiki | Fandom powered by Wikia',
			appleItunesApp: 'app-id=1234, app-argument=http://muppet.wikia.com/wiki/Kermit',
			robots: 'index,follow',
			keywords: 'The Fallout wiki - Fallout: New Vegas and more,MediaWiki,fallout,Kermit The Frog'
		};

		var headData = void 0;

		mock.setProperties({
			removeServerTags: function removeServerTags() {},
			setStaticHeadTags: function setStaticHeadTags() {},

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
						ios: '1234'
					}
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

	(0, _emberQunit.test)('set head tags without apple-itunes-app when appId is not set', function (assert) {
		var mock = this.subject(),
		    expectedAppleItunesApp = '';

		var headData = void 0;

		mock.setProperties({
			removeServerTags: function removeServerTags() {},
			setStaticHeadTags: function setStaticHeadTags() {},

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
				specialRobotPolicy: 'index,follow'
			}
		});

		mock.setDynamicHeadTags(model);
		headData = mock.get('headData');

		assert.equal(headData.appleItunesApp, expectedAppleItunesApp);
	});

	(0, _emberQunit.test)('get correct handler based on model namespace', function (assert) {
		var mock = this.subject(),
		    testCases = [{
			expectedHandler: {
				viewName: 'article',
				controllerName: 'article'
			},
			model: EmberObject.create({
				ns: 0
			})
		}, {
			expectedHandler: {
				viewName: 'article',
				controllerName: 'article'
			},
			model: EmberObject.create({
				ns: 112
			})
		}, {
			expectedHandler: {
				viewName: 'category',
				controllerName: 'category'
			},
			model: EmberObject.create({
				ns: 14
			})
		}, {
			expectedHandler: null,
			model: EmberObject.create({
				ns: 200
			})
		}];

		mock.set('wikiVariables', {
			contentNamespaces: [0, 112]
		});

		testCases.forEach(function (_ref) {
			var expectedHandler = _ref.expectedHandler,
			    model = _ref.model;

			var handler = mock.getHandler(model);

			if (handler) {
				assert.equal(handler.viewName, expectedHandler.viewName, 'viewName is different than expected');
				assert.equal(handler.controllerName, expectedHandler.controllerName, 'controllerName is different than expected');
			} else {
				assert.equal(handler, expectedHandler, 'handler is not null');
			}
		});
	});

	(0, _emberQunit.test)('get correct handler based on model isCuratedMainPage', function (assert) {
		var mock = this.subject(),
		    expectedHandler = {
			viewName: 'main-page',
			controllerName: 'main-page'
		};

		var handler = void 0;

		model.isCuratedMainPage = true;

		handler = mock.getHandler(model);

		assert.equal(handler.viewName, expectedHandler.viewName, 'viewName is different than expected');
		assert.equal(handler.controllerName, expectedHandler.controllerName, 'controllerName is different than expected');
	});

	(0, _emberQunit.test)('reset ads variables on before model', function (assert) {
		isInitialPageViewStub.returns(false);

		var mock = this.subject();
		mock.controllerFor = function () {
			return {
				send: function send() {}
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
});