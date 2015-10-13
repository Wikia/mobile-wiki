moduleFor('mixin:ads', 'AdsMixin');

test('setup ads context', function() {
	var context = {
			a: 1
		},
		gotContext = false,
		runCalled = false,
		mixinClass = Ember.Object.extend(App.AdsMixin),
		mixin = mixinClass.create({}),
		original = Mercury.Modules.Ads.getInstance;

	Mercury.Modules.Ads.getInstance = function () {
		return {
			reload: function(context) {
				gotContext = context;
			}
		}
	};

	mixin.setupAdsContext(context);
	Mercury.Modules.Ads.getInstance = original;
	equal(gotContext, context, 'Set the ads context');
});
