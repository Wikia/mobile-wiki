var originalM;

moduleFor('route:MainPageCategory', 'MainPageCategoryRoute', {
	setup: function () {
		originalM = M;
	},
	teardown: function () {
		M = originalM;
	}
});

test('sets controller properties', function () {
	var routeMock = this.subject(),
		title = '~`!@#$%^&*() +-={}[]\|;:\'"<>?,./',
		encodedTitle = '~%60!%40%23%24%25%5E%26*()%20%2B-%3D%7B%7D%5B%5D%7C%3B%3A\'%22%3C%3E%3F%2C.%2F',
		doubleEncodedTitle = '~%2560!%2540%2523%2524%2525%255E%2526*()%2520%252B-%253D%257B%257D%255B%255D%257C%253B%253A\'%2522%253C%253E%253F%252C.%252F',
		modelWithEncodedTitle = Ember.Object.create({
			title: encodedTitle
		}),
		modelWithDoubleEncodedTitle = Ember.Object.create({
			title: doubleEncodedTitle
		}),
		adsContext = {
			type: 'main'
		},
		ns = 0;

	M = {
		prop: function (propName) {
			if (propName === 'mainPageData.adsContext') {
				return adsContext;
			} else if (propName === 'mainPageData.ns') {
				return ns;
			}
		},
		String: {
			normalizeToWhitespace: function (str) {
				return str
					.replace(/_/g, ' ')
					.replace(/\s+/g, ' ');
			}
		}
	};

	// Single encoded title - user goes straight to the page by URL and Ember does decodeURI automatically
	routeMock.controllerFor = function () {
		return {
			setProperties: function (data) {
				equal(data.isRoot, false);
				equal(data.title, title);
				deepEqual(data.adsContext, adsContext);
				equal(data.ns, ns);
			}
		}
	};
	routeMock.afterModel(modelWithEncodedTitle);

	// Double encoded title - user goes to the page from link (transition) and Ember doesn't do decodeURI
	routeMock.controllerFor = function () {
		return {
			setProperties: function (data) {
				equal(data.isRoot, false);
				equal(data.title, title);
				deepEqual(data.adsContext, adsContext);
				equal(data.ns, ns);
			}
		}
	};
	routeMock.afterModel(modelWithDoubleEncodedTitle);
});
