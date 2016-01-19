QUnit.module('M.state, property & namespace methods (loaded in baseline):', function () {
	QUnit.test('Methods provide, prop, props should be exported', function (assert) {
		var methods = ['provide', 'prop', 'props'];

		methods.forEach(function (method) {
			assert.ok(typeof M[method] === 'function');
		});
	});

	QUnit.test('M.provide should create the proper namespaced object with correct value', function (assert) {
		M.provide('foo', 'bar');
		assert.ok(Mercury.foo === 'bar');
		M.provide('foo', {});
		// Deep object creation
		M.provide('foo.bar', 1);
		assert.ok(Mercury.foo.bar === 1);
		M.provide('foo.baz', 2);
		assert.ok(Mercury.foo.baz === 2);
	});

	QUnit.test('M.prop should set property or objects, immutable by default', function (assert) {
		M.prop('mproptest', 'value');
		assert.ok(M.prop('mproptest') === 'value');

		throws(function () {
			M.prop('mproptest', 'should fail');
		}, TypeError, 'Attempting to change value of a readonly property');
	});

	QUnit.test('M.props should set property or objects, immutable by default', function (assert) {
		M.props({
			propstest: {
				foo: 1
			}
		});
		assert.ok(M.prop('propstest.foo') === 1);

		throws(function () {
			M.prop('propstest', 'should fail');
		}, TypeError, 'Attempting to change value of a readonly property');
	});

	QUnit.test('M.prop should set property or objects, mutable through configuration', function (assert) {
		M.prop('mproptest2', 'value', true);
		assert.ok(M.prop('mproptest2') === 'value');

		M.prop('mproptest2', 'ok');
		assert.ok(M.prop('mproptest2') === 'ok');
	});

	QUnit.test('M.props should set property or objects, mutable through configuration', function (assert) {
		M.props({
			propstest2: {
				foo: 1
			}
		}, true);
		assert.ok(M.prop('propstest2.foo') === 1);

		M.props({
			propstest2: {
				foo: 'ok'
			}
		});
		assert.ok(M.prop('propstest2.foo') === 'ok');
	});
});
