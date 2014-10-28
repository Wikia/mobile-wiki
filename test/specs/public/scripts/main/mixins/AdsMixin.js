module("AdsMixin");

test('setup ads context', function() {
	var context = {
			a: 1
		},
		gotContext = false,
		runCalled = false,
		testObj = Em.Object.createWithMixins(App.AdsMixin, {}),
		original = Mercury.Modules.Ads.getInstance;

	Mercury.Modules.Ads.getInstance = function () {
		return {
			reload: function(context) {
				gotContext = context;
			}
		}
	};

	testObj.setupAdsContext(context);
	Mercury.Modules.Ads.getInstance = original;
	equal(gotContext, context, 'Set the ads context');
});
