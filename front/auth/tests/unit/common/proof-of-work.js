QUnit.module('auth/common/proof-of-work', function () {
	QUnit.test('ProofOfWork is loaded', function (assert) {
		assert.ok(typeof require('auth/app/common/proof-of-work').default === 'function');
	});

	QUnit.test('ProofOfWork proof', function (assert) {
		var ProofOfWork = require('auth/app/common/proof-of-work').default,
			testCases = [
				{
					challenge: '1:10:160323145541:user-registration-users-91.102.115.105:' +
						'4269b82e2f46d4ca83fee5326355a3db45ce98eb:beScbgls:',
					bits: 10,
					expected: '83'
				},
				{
					challenge: '1:10:160323145715:user-registration-users-91.102.115.105:' +
						'0eec38a67d570816bb01f43c2fda9fa78ba08006:PQUsvu9e:',
					bits: 10,
					expected: '2a'
				},
				{
					challenge: '1:10:160323145750:user-registration-users-91.102.115.105:' +
						'a40f5051e695f7e0407624c377b940e326c279bd:d0sUWyGD:',
					bits: 10,
					expected: '111'
				},
			];

		testCases.forEach(function (testCase) {
			assert.equal(ProofOfWork.proof(testCase.challenge, testCase.bits).counter, testCase.expected);
		});
	});
});
