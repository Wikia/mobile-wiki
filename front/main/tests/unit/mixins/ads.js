moduleFor('mixin:ads', 'AdsMixin');

test('setup ads context', function() {
	var context = {
			a: 1
		},
		gotContext = false,
		mixin = getMixin('ads'),
		original = mrequire('mercury/modules/Ads').default.getInstance;

	mrequire('mercury/modules/Ads').default.getInstance = function () {
		return {
			reload: function(context) {
				gotContext = context;
			}
		}
	};

	mixin.setupAdsContext(context);
	mrequire('mercury/modules/Ads').default.getInstance = original;
	equal(gotContext, context, 'Set the ads context');
});
