import {visit, click} from '@ember/test-helpers';
import {test, module} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | Article page', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
	});

	test('visiting Article Page', async (assert) => {
		await visit('/');
		await visit('/wiki/Qaga2');

		assert.dom('.wiki-page-header__title').exists();
		assert.dom('.wiki-page-header__title').hasText('Qaga2');
		assert.dom('.wiki-page-header__wrapper .edit-section').exists();
		assert.dom('.section-header-label').exists();
		assert.dom('#Test_1').doesNotHaveClass('open-section');
		// assert.dom('.section-header-label .edit-section').isNotVisible();

		await click('.section-header-label');
		assert.dom('#Test_1').hasClass('open-section');

	});
});

