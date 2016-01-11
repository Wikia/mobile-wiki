QUnit.module('mercury/utils/truncate', function (hooks) {
	var truncate;

	hooks.beforeEach(function () {
		truncate = mrequire('mercury/utils/truncate').default;
	});

	QUnit.test('Truncate helper is exported', function () {
		ok(truncate);
	});

	QUnit.test('short text', function () {
		equal(truncate(['short text']), 'short text');
	});

	QUnit.test('long text', function () {
		equal(truncate(['long text, please truncate', 20]), 'long text, please\u2026');
	});

	QUnit.test('number instead of text', function () {
		equal(truncate([20]), null);
	});
});
