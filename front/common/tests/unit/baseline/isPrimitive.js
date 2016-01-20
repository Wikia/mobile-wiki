QUnit.module('M.isPrimitive (loaded with baseline scripts)', function () {
	QUnit.test('isPrimitive is loaded', function (assert) {
		assert.ok(typeof M.isPrimitive === 'function');
	});

	QUnit.test('isPrimitive is loaded', function (assert) {
		var primitiveTestCases = ['string', 1, NaN, true, false, undefined, null],
			compositeTestCases = [{}, []];

		primitiveTestCases.forEach(function (test) {
			assert.ok(M.isPrimitive(test));
		});

		compositeTestCases.forEach(function (test) {
			assert.ok(!M.isPrimitive(test));
		});
	});
});
