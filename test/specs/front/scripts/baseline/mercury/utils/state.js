QUnit.module('Mercury.Utils state, property & namespace methods (loaded in baseline):');

QUnit.test('Methods provide, prop, props should be exported', function () {
	var methods = ['provide', 'prop', 'props'];
	methods.forEach(function (method) {
		ok(typeof M[method] === 'function');
	});
});

QUnit.test('M.provide should create the proper namespaced object with correct value', function () {
	M.provide('foo', 'bar');
	ok(Mercury.foo === 'bar');
	M.provide('foo', {});
	// Deep object creation
	M.provide('foo.bar', 1);
	ok(Mercury.foo.bar === 1);
	M.provide('foo.baz', 2);
	ok(Mercury.foo.baz === 2);
});

QUnit.test('M.prop should set property or objects, immutable by default', function () {
	M.prop('mproptest', 'value');
	ok(M.prop('mproptest') === 'value');

	throws(function () {
		M.prop('mproptest', 'should fail')
	}, TypeError, 'Attempting to change value of a readonly property');
});

QUnit.test('M.props should set property or objects, immutable by default', function () {
	M.props({
		propstest: {
			foo: 1
		}
	});
	ok(M.prop('propstest.foo') === 1);

	throws(function () {
		M.props('propstest', 'should fail')
	}, TypeError, 'Attempting to change value of a readonly property');
});

QUnit.test('M.prop should set property or objects, mutable through configuration', function () {
	M.prop('mproptest2', 'value', true);
	ok(M.prop('mproptest2') === 'value');

	M.prop('mproptest2', 'ok');
	ok(M.prop('mproptest2') === 'ok');
});

QUnit.test('M.props should set property or objects, mutable through configuration', function () {
	M.props({
		propstest2: {
			foo: 1
		}
	}, true);
	ok(M.prop('propstest2.foo') === 1);

	M.props({
		propstest2: {
			foo: 'ok'
		}
	});
	ok(M.prop('propstest2.foo') === 'ok');
});


