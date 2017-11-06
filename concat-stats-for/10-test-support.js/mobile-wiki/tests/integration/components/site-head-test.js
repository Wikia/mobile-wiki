define('mobile-wiki/tests/integration/components/site-head-test', ['sinon', 'require', 'ember-qunit'], function (_sinon, _require2, _emberQunit) {
	'use strict';

	var trackModule = (0, _require2.default)('mobile-wiki/utils/track'),
	    searchIconSelector = '.site-head-icon-search .site-head-icon',
	    navIconSelector = '.site-head-icon-nav';
	var trackStub = void 0;

	(0, _emberQunit.moduleForComponent)('site-head', 'Integration | Component | site head', {
		integration: true,

		beforeEach: function beforeEach() {
			trackStub = _sinon.default.stub(trackModule, 'track');
		},
		afterEach: function afterEach() {
			trackStub.restore();
		}
	});

	(0, _emberQunit.test)('click search icon when already in search and drawer visible - hide menu', function (assert) {
		this.set('actions', {
			toggleDrawer: function toggleDrawer(value) {
				assert.equal(value, false);
			},
			setDrawerContent: function setDrawerContent(value) {
				assert.equal(value, false);
			}
		});

		this.render(Ember.HTMLBars.template({
			"id": "8ctc00kL",
			"block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[1,[25,\"site-head\",null,[[\"toggleDrawer\",\"setDrawerContent\",\"drawerContent\",\"drawerVisible\"],[[25,\"action\",[[19,0,[]],\"toggleDrawer\"],null],[25,\"action\",[[19,0,[]],\"setDrawerContent\"],null],\"search\",true]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		this.$(searchIconSelector).click();
	});

	(0, _emberQunit.test)('click search icon when already in search but drawer not visible - show search', function (assert) {
		this.set('actions', {
			toggleDrawer: function toggleDrawer(value) {
				assert.equal(value, true);
			},
			setDrawerContent: function setDrawerContent(value) {
				assert.equal(value, 'search');
			}
		});

		this.render(Ember.HTMLBars.template({
			"id": "72u7K+fL",
			"block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[1,[25,\"site-head\",null,[[\"toggleDrawer\",\"setDrawerContent\",\"drawerContent\",\"drawerVisible\"],[[25,\"action\",[[19,0,[]],\"toggleDrawer\"],null],[25,\"action\",[[19,0,[]],\"setDrawerContent\"],null],\"search\",false]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		this.$(searchIconSelector).click();
	});

	(0, _emberQunit.test)('click search icon when already visible is navigation - show search', function (assert) {
		this.set('actions', {
			toggleDrawer: function toggleDrawer(value) {
				assert.equal(value, true);
			},
			setDrawerContent: function setDrawerContent(value) {
				assert.equal(value, 'search');
			}
		});

		this.render(Ember.HTMLBars.template({
			"id": "+gnWKYGg",
			"block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[1,[25,\"site-head\",null,[[\"toggleDrawer\",\"setDrawerContent\",\"drawerContent\",\"drawerVisible\"],[[25,\"action\",[[19,0,[]],\"toggleDrawer\"],null],[25,\"action\",[[19,0,[]],\"setDrawerContent\"],null],\"nav\",true]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		this.$(searchIconSelector).click();
	});

	(0, _emberQunit.test)('click nav icon when already visible is search - show nav', function (assert) {
		this.set('actions', {
			toggleDrawer: function toggleDrawer(value) {
				assert.equal(value, true);
			},
			setDrawerContent: function setDrawerContent(value) {
				assert.equal(value, 'nav');
			}
		});

		this.render(Ember.HTMLBars.template({
			"id": "8ctc00kL",
			"block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[1,[25,\"site-head\",null,[[\"toggleDrawer\",\"setDrawerContent\",\"drawerContent\",\"drawerVisible\"],[[25,\"action\",[[19,0,[]],\"toggleDrawer\"],null],[25,\"action\",[[19,0,[]],\"setDrawerContent\"],null],\"search\",true]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		this.$(navIconSelector).click();
	});
});