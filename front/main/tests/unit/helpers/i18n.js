QUnit.module('main/helpers/i18n', function (hooks) {
	var originali18nGlobal,
		tStub = sinon.stub(),
		i18nHelper;

	hooks.beforeEach(function () {
		originali18nGlobal = i18n;
		i18n = {
			t: tStub
		};

		i18nHelper = mrequire('main/helpers/i18n').default.compute;
	});

	hooks.afterEach(function () {
		i18n = originali18nGlobal;
	});

	QUnit.test('i18n helper is exported', function () {
		ok(i18nHelper);
	});

	QUnit.test('i18n is called', function () {
		i18nHelper(['string'], {});

		ok(tStub.calledWith('main:string', {}));
	});

	QUnit.test('namespace param works', function () {
		i18nHelper(['string'], {
			ns: 'discussion'
		});

		ok(tStub.calledWith('discussion:string', {}));
	});

	QUnit.test('string concatenation works', function () {
		i18nHelper(['app', 'string'], {});

		ok(tStub.calledWith('main:app.string', {}));
	});

	QUnit.test('extra i18n params work', function () {
		var i18nParams = {
			count: '5'
		};

		i18nHelper(['string'], i18nParams);

		ok(tStub.calledWith('main:string', i18nParams));
	});
});
