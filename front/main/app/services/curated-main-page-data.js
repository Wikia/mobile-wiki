export default Ember.Service.extend({
	adsContext: Ember.computed({
		get() {
			return M.prop('mainPageData.adsContext');
		},
		set(_, value) {
			return value;
		}
	}),

	ns: Ember.computed({
		get() {
			return M.prop('mainPageData.details.ns');
		},
		set(_, value) {
			return value;
		}
	}),

	description: Ember.computed({
		get() {
			return M.prop('mainPageData.details.description');
		},
		set(_, value) {
			return value;
		}
	})
});
