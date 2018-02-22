import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Service | ads', function (hooks) {
	setupTest(hooks);

	test('noAds is set correctly base on passed Query Parameter and logged in user', function (assert) {
		const service = this.owner.lookup('service:ads'),
			testCases = [
				{
					noAdsQueryParam: 'false',
					expected: true,
					msg: 'noAds set to true when \'false\' passed'
				}, {
					noAdsQueryParam: 'true',
					expected: true,
					msg: 'noAds set to true when \'true\' passed'
				}, {
					noAdsQueryParam: '0',
					expected: false,
					msg: 'noAds set to false when \'0\' passed'
				}, {
					noAdsQueryParam: '',
					expected: false,
					msg: 'noAds set to false when \'\' passed'
				}, {
					noAdsQueryParam: 'foo',
					expected: true,
					msg: 'noAds set to true when \'true\' passed'
				}, {
					noAdsQueryParam: '0',
					userId: null,
					expected: false,
					msg: 'noAds set to false when \'0\' passed and user not logged in'
				}, {
					noAdsQueryParam: '',
					userId: 123454,
					expected: true,
					msg: 'noAds set to true when \'0\' passed and user logged in'
				}, {
					noAdsQueryParam: 'true',
					userId: 123454,
					expected: true,
					msg: 'noAds set to true when \'true\' passed and user logged in'
				}
			];

		testCases.forEach((testCase) => {
			service.set('currentUser', {
				isAuthenticated: Boolean(testCase.userId)
			});
			service.set('noAdsQueryParam', testCase.noAdsQueryParam);
			assert.equal(service.get('noAds'), testCase.expected, testCase.msg);
		});
	});
});
