import { visit, click } from '@ember/test-helpers';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';
import * as adsModule from 'mobile-wiki/modules/ads';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService, { getAdsModuleMock } from '../helpers/mock-ads-service';


module('Acceptance | Article page', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);

		sinon.stub(adsModule, 'default').returns({
			then: cb => cb(getAdsModuleMock({
				opts: {
					areMobileStickyAndSwapEnabled: true,
				},
			})),
		});
	});

	hooks.afterEach(() => {
		adsModule.default.restore();
	});


	test('visiting Article Page', async (assert) => {
		await visit('/');
		await visit('/wiki/Qaga2');

		assert.dom('.wiki-page-header__title').exists();
		assert.dom('.wiki-page-header__title').hasText('Qaga2');
		assert.dom('.section-header-label').exists();
		assert.dom('#Test_1').doesNotHaveClass('open-section');

		await click('.section-header-label');
		assert.dom('#Test_1').hasClass('open-section');

	});
});
