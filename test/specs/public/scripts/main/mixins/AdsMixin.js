module("AdsMixin");

test('setup ads context', function() {
	var context = {
			a: 1
		},
		gotContext = {},
		runCalled = false,
		testObj = Em.Object.createWithMixins(App.AdsMixin, {});
	expect(2);
	require = function (modules, callback) {
		callback(
			{
				run: function() {
					runCalled = true;
				}
			},
			{
				setContext: function(context) {
					gotContext = context;
				}
			}
		);
	};
	testObj.setupAdsContext(context);
	equal(gotContext, context, 'Set the ads context');
	equal(runCalled, true, 'AdEngine was run');
});
