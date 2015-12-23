QUnit.module('main/helpers/truncate', function (hooks) {
	var truncateHelper;

	hooks.beforeEach(function () {
		truncateHelper = mrequire('main/helpers/truncate').default.compute;
	});

	QUnit.test('Truncate helper is exported', function () {
		ok(truncateHelper);
	});

	QUnit.test('short text', function () {
		equal(truncateHelper(['short text']), 'short text');
	});

	QUnit.test('long text', function () {
		equal(truncateHelper(['long text, please truncate', 20]), 'long text, please\u2026');
	});

	QUnit.test('number instead of text', function () {
		equal(truncateHelper([20]), null);
	});
});
