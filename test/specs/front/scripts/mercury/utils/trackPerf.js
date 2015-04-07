QUnit.module('M::trackPerf', {
	setup: function () {
		Mercury.Modules.Trackers.Perf.checkDependencies = function () { return true; };
	},
	teardown: function () {
		Mercury.Modules.Trackers.Perf.checkDependencies = function () { return false; };
	}
});


test('track instance method is properly called', function () {
	var proto = Mercury.Modules.Trackers.Perf.prototype;
	var mock = sinon.mock(proto).expects('track').atLeast(1).atMost(2);

	M.trackPerf();
	M.trackPerf();

	mock.verify();
	proto.track.restore();
});
