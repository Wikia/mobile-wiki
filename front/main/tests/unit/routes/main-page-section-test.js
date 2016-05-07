import {test, moduleFor} from 'ember-qunit';

let originalM;

moduleFor('route:mainPageSection', 'Unit | Route | main page section', {
	beforeEach() {
		originalM = M;
		window.wgNow = null;
	},
	afterEach() {
		M = originalM;
	}
});

test('sets controller properties', function (assert) {
	const routeMock = this.subject(),
		title = '~`!@#$%^&*() +-={}[]\|;:\'"<>?,./',
		encodedTitle = '~%60!%40%23%24%25%5E%26*()%20%2B-%3D%7B%7D%5B%5D%7C%3B%3A\'%22%3C%3E%3F%2C.%2F',
		doubleEncodedTitle = '~%2560!%2540%2523%2524%2525%255E%2526*' +
			'()%2520%252B-%253D%257B%257D%255B%255D%257C%253B%253A\'%2522%253C%253E%253F%252C.%252F',
		modelWithEncodedTitle = Ember.Object.create({
			title: encodedTitle
		}),
		modelWithDoubleEncodedTitle = Ember.Object.create({
			title: doubleEncodedTitle
		}),
		adsContext = {
			type: 'main'
		},
		ns = 0,
		transitionMock = {
			then: () => {}
		},
		removeServerTagsMock = Ember.K,
		setStaticHeadTagsMock = Ember.K,
		setDynamicHeadTagsMock = Ember.K;

	// Mock methods from head-tags::afterModel() mixin
	routeMock.setProperties({
		removeServerTags: removeServerTagsMock,
		setStaticHeadTags: setStaticHeadTagsMock,
		setDynamicHeadTags: setDynamicHeadTagsMock
	});

	M = {
		prop(propName) {
			if (propName === 'mainPageData.adsContext') {
				return adsContext;
			} else if (propName === 'mainPageData.ns') {
				return ns;
			}
		},
		String: {
			normalizeToWhitespace(str) {
				return str
					.replace(/_/g, ' ')
					.replace(/\s+/g, ' ');
			}
		}
	};

	// We want to mock adsContext and ns inside route
	// Normally adsContext and ns are taken from curated-main-paga-data service
	routeMock.setProperties({
		adsContext,
		ns
	});


	// Single encoded title - user goes straight to the page by URL and Ember does decodeURI automatically
	routeMock.controllerFor = function () {
		return {
			setProperties(data) {
				assert.equal(data.isRoot, false);
				assert.equal(data.title, title);
				assert.deepEqual(data.adsContext, adsContext);
				assert.equal(data.ns, ns);
			}
		};
	};
	routeMock.afterModel(modelWithEncodedTitle, transitionMock);

	// Double encoded title - user goes to the page from link (transition) and Ember doesn't do decodeURI
	routeMock.controllerFor = function () {
		return {
			setProperties(data) {
				assert.equal(data.isRoot, false);
				assert.equal(data.title, title);
				assert.deepEqual(data.adsContext, adsContext);
				assert.equal(data.ns, ns);
			}
		};
	};
	routeMock.afterModel(modelWithDoubleEncodedTitle, transitionMock);
});

test('reset ads variables on before model', function (assert) {
	const mock = this.subject();

	M.prop('initialPageView', false);
	mock.beforeModel();

	assert.notEqual(window.wgNow, null);
});
