import sinon from 'sinon';
import {moduleFor, test} from 'ember-qunit';

moduleFor('service:ads-state', 'Unit | Service | ads state', {
	unit: true
});

test('noAds is set correctly base on passed Query Parameter and logged in user', function (assert) {
	const propStub = sinon.stub(M, 'prop'),
		service = this.subject(),
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
		propStub.withArgs('userId').returns(testCase.userId);

		service.set('noAdsQueryParam', testCase.noAdsQueryParam);
		assert.equal(service.get('noAds'), testCase.expected, testCase.msg);
	});

	M.prop.restore();
});
