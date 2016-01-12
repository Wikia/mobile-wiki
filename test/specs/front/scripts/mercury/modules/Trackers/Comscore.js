/* global Mercury, _comscore */
QUnit.module('mercury/modules/Trackers/Comscore', function (hooks) {
	var Comscore;

	hooks.beforeEach(function () {
		var exports = {};

		mrequire.entries['mercury/modules/Trackers/Comscore'].callback(exports, null);

		Comscore = exports.default;

		M.props({
			tracking: {
				comscore: {
					keyword: 'comscorekw',
					id: '123',
					c7: 'c7',
					c7Value: 'c7value'
				}
			}
		// initialize with mutations because tests are run multiple times
		}, true);
	});

	QUnit.test('Comscore is compiled', function () {
		ok(Comscore);
		strictEqual(typeof Comscore, 'function');
	});

	QUnit.test('Track page view', function () {
		var queue,
			instance;

		instance = new Comscore();
		queue = [{
			c1: '2',
			c2: M.prop('tracking.comscore.id'),
			options: {
				url_append: M.prop('tracking.comscore.keyword') + '=' + M.prop('tracking.comscore.c7Value')
			}
		}];

		instance.appendScript = sinon.stub();

		instance.trackPageView();
		deepEqual(window._comscore, queue);
	});
});
