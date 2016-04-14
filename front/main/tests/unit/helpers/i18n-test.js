import {test} from 'ember-qunit';
import {module} from 'qunit';
import i18nHelper from 'main/helpers/i18n';
import sinon from 'sinon';

module('Unit | Helper | i18n', (hooks) => {
	const tStub = sinon.stub();
	let originalI18nGlobal;

	hooks.beforeEach(() => {
		originalI18nGlobal = window.i18n;
		window.i18n = {
			t: tStub
		};
	});

	hooks.afterEach(() => {
		window.i18n = originalI18nGlobal;
	});

	test('i18n helper is exported', (assert) => {
		assert.ok(i18nHelper.compute);
	});

	test('i18n is called', (assert) => {
		i18nHelper.compute(['string'], {});

		assert.ok(tStub.calledWith('main:string', {}));
	});

	test('namespace param works', (assert) => {
		i18nHelper.compute(['string'], {
			ns: 'discussion'
		});

		assert.ok(tStub.calledWith('discussion:string', {}));
	});

	test('string concatenation works', (assert) => {
		i18nHelper.compute(['app', 'string'], {});

		assert.ok(tStub.calledWith('main:app.string', {}));
	});

	test('extra i18n params work', (assert) => {
		const i18nParams = {
			count: '5'
		};

		i18nHelper.compute(['string'], i18nParams);

		assert.ok(tStub.calledWith('main:string', i18nParams));
	});

	test('extra i18n int params work', (assert) => {
		const i18nParams = {
			count: 5
		};

		i18nHelper.compute(['string'], i18nParams);

		assert.ok(tStub.calledWith('main:string', i18nParams));
	});
});
