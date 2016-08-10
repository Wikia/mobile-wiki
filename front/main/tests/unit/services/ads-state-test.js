import {moduleFor, test} from 'ember-qunit';

moduleFor('service:ads-state', 'Unit | Service | ads state', {
	unit: true
});

test('noAds is set correctly base on passed Query Parameter', function (assert) {
	const service = this.subject(),
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
			}
		];

	testCases.forEach((testCase) => {
		service.set('noAdsQueryParam', testCase.noAdsQueryParam);
		assert.equal(service.get('noAds'), testCase.expected, testCase.msg);
	});
});
