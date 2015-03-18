QUnit.module('Mercury.Utils.isPrimitive (loaded with baseline scripts)');

QUnit.test('isPrimitive is loaded', function () {
	ok(typeof M.isPrimitive === 'function');
});

QUnit.test('isPrimitive is loaded', function () {
	var primitiveTestCases = ['string', 1, NaN, true, false, undefined, null],
		compositeTestCases = [{}, []];

	primitiveTestCases.forEach(function (test) {
		ok(M.isPrimitive(test));
	});

	compositeTestCases.forEach(function (test) {
		ok(!M.isPrimitive(test));
	});
});

