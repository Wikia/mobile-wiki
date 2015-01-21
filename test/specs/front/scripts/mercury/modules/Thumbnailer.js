/* global Mercury */
QUnit.module('Thumbnailer tests');

QUnit.test('Thumbnailer is compiled into Mercury.Modules namespace', function () {
	ok(Mercury.Modules.Thumbnailer);
	equal(typeof Mercury.Modules.Thumbnailer, 'function');
});
