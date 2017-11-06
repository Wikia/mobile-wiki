define('mobile-wiki/tests/unit/helpers/i18n-test', ['ember-qunit', 'qunit', 'mobile-wiki/helpers/i18n', 'sinon'], function (_emberQunit, _qunit, _i18n, _sinon) {
	'use strict';

	(0, _qunit.module)('Unit | Helper | i18n', function (hooks) {
		var tStub = _sinon.default.stub();
		var i18nHelper = void 0;

		hooks.beforeEach(function () {
			i18nHelper = new _i18n.default();
			i18nHelper.set('i18n', { t: tStub });
		});

		(0, _emberQunit.test)('i18n helper is exported', function (assert) {
			assert.ok(i18nHelper.compute);
		});

		(0, _emberQunit.test)('i18n is called', function (assert) {
			i18nHelper.compute(['string'], {});

			assert.ok(tStub.calledWith('main:string', {}));
		});

		(0, _emberQunit.test)('namespace param works', function (assert) {
			i18nHelper.compute(['string'], {
				ns: 'discussion'
			});

			assert.ok(tStub.calledWith('discussion:string', {}));
		});

		(0, _emberQunit.test)('string concatenation works', function (assert) {
			i18nHelper.compute(['app', 'string'], {});

			assert.ok(tStub.calledWith('main:app.string', {}));
		});

		(0, _emberQunit.test)('extra i18n params work', function (assert) {
			var i18nParams = {
				count: '5'
			};

			i18nHelper.compute(['string'], i18nParams);

			assert.ok(tStub.calledWith('main:string', i18nParams));
		});

		(0, _emberQunit.test)('extra i18n int params work', function (assert) {
			var i18nParams = {
				count: 5
			};

			i18nHelper.compute(['string'], i18nParams);

			assert.ok(tStub.calledWith('main:string', i18nParams));
		});
	});
});