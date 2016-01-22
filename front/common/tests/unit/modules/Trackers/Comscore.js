QUnit.module('mercury/modules/Trackers/Comscore', function (hooks) {
	var Comscore;

	hooks.beforeEach(function () {
		var exports = {};

		require.entries['common/modules/Trackers/Comscore'].callback(exports, null);

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

	QUnit.test('Comscore is compiled', function (assert) {
		assert.ok(Comscore);
		assert.strictEqual(typeof Comscore, 'function');
	});

	QUnit.test('Track page view', function (assert) {
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
		assert.deepEqual(window._comscore, queue);
	});
});
