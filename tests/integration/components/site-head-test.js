import {find, render} from '@ember/test-helpers';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import require from 'require';
import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';

const trackModule = require('mobile-wiki/utils/track'),
	searchIconSelector = '.site-head-icon-search .site-head-icon',
	navIconSelector = '.site-head-icon-nav';
let trackStub;

module('Integration | Component | site head', (hooks) => {
	setupRenderingTest(hooks);

	hooks.beforeEach(() => {
		trackStub = sinon.stub(trackModule, 'track');
	});

	hooks.afterEach(() => {
		trackStub.restore();
	});

	test('click search icon when already in search and drawer visible - hide menu', async function (assert) {
		this.set('toggleDrawer', (value) => {
			assert.equal(value, false);
		});

		this.set('setDrawerContent', (value) => {
			assert.equal(value, false);
		});

		await render(hbs`
      {{site-head
          toggleDrawer=(action toggleDrawer)
          setDrawerContent=(action setDrawerContent)
          drawerContent='search'
          drawerVisible=true
      }}`);

		find(searchIconSelector).click();
	});

	test('click search icon when already in search but drawer not visible - show search', async function (assert) {
		this.set('toggleDrawer', (value) => {
			assert.equal(value, true);
		});

		this.set('setDrawerContent', (value) => {
			assert.equal(value, 'search');
		});

		await render(hbs`
      {{site-head
          toggleDrawer=(action toggleDrawer)
          setDrawerContent=(action setDrawerContent)
          drawerContent='search'
          drawerVisible=false
      }}`);

		find(searchIconSelector).click();
	});

	test('click search icon when already visible is navigation - show search', async function (assert) {
		this.set('toggleDrawer', (value) => {
			assert.equal(value, true);
		});

		this.set('setDrawerContent', (value) => {
			assert.equal(value, 'search');
		});

		await render(hbs`
      {{site-head
          toggleDrawer=(action toggleDrawer)
          setDrawerContent=(action setDrawerContent)
          drawerContent='nav'
          drawerVisible=true
      }}`);

		find(searchIconSelector).click();
	});

	test('click nav icon when already visible is search - show nav', async function (assert) {
		this.set('toggleDrawer', (value) => {
			assert.equal(value, true);
		});

		this.set('setDrawerContent', (value) => {
			assert.equal(value, 'nav');
		});

		await render(hbs`
      {{site-head
          toggleDrawer=(action toggleDrawer)
          setDrawerContent=(action setDrawerContent)
          drawerContent='search'
          drawerVisible=true
      }}`);

		find(navIconSelector).click();
	});
});
