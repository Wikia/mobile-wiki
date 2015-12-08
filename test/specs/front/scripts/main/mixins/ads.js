moduleFor('mixin:ads', 'AdsMixin');

test('setup ads context', function() {
	var context = {
			a: 1
		},
		gotContext = false,
		runCalled = false,
		mixinClass = Ember.Object.extend(App.AdsMixin),
		mixin = mixinClass.create({}),
		original = require('mercury/modules/Ads').default.getInstance;

	require('mercury/modules/Ads').default.getInstance = function () {
		return {
			reload: function(context) {
				gotContext = context;
			}
		}
	};

	mixin.setupAdsContext(context);
	require('mercury/modules/Ads').default.getInstance = original;
	equal(gotContext, context, 'Set the ads context');
});
