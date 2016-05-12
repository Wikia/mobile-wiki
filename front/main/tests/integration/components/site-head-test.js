import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const trackModule = require('common/utils/track'),
	searchIconSelector = '.site-head-icon-search',
	navIconSelector = '.site-head-icon-nav';
let trackStub;

moduleForComponent('site-head', 'Integration | Component | site head', {
	integration: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
	},

	afterEach() {
		trackStub.restore();
	}
});

test('click search icon when already in search and drawer visible - hide menu', function (assert) {
	this.set('actions', {
		toggleDrawer(value) {
			assert.equal(value, false);
		},

		setDrawerContent(value) {
			assert.equal(value, null);
		}
	});

	this.render(hbs`
	{{site-head
		toggleDrawer=(action 'toggleDrawer')
		setDrawerContent=(action 'setDrawerContent')
		drawerContent='search'
		drawerVisible=true
	}}`);

	this.$(searchIconSelector).click();
});

test('click search icon when already in search but drawer not visible - show search', function (assert) {
	this.set('actions', {
		toggleDrawer(value) {
			assert.equal(value, true);
		},

		setDrawerContent(value) {
			assert.equal(value, 'search');
		}
	});

	this.render(hbs`
	{{site-head
		toggleDrawer=(action 'toggleDrawer')
		setDrawerContent=(action 'setDrawerContent')
		drawerContent='search'
		drawerVisible=false
	}}`);

	this.$(searchIconSelector).click();
});

test('click search icon when already visible is navigation - show search', function (assert) {
	this.set('actions', {
		toggleDrawer(value) {
			assert.equal(value, true);
		},

		setDrawerContent(value) {
			assert.equal(value, 'search');
		}
	});

	this.render(hbs`
	{{site-head
		toggleDrawer=(action 'toggleDrawer')
		setDrawerContent=(action 'setDrawerContent')
		drawerContent='nav'
		drawerVisible=true
	}}`);

	this.$(searchIconSelector).click();
});

test('click nav icon when already visible is search - show nav', function (assert) {
	this.set('actions', {
		toggleDrawer(value) {
			assert.equal(value, true);
		},

		setDrawerContent(value) {
			assert.equal(value, 'nav');
		}
	});

	this.render(hbs`
	{{site-head
		toggleDrawer=(action 'toggleDrawer')
		setDrawerContent=(action 'setDrawerContent')
		drawerContent='search'
		drawerVisible=true
	}}`);

	this.$(navIconSelector).click();
});
