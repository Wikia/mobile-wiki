import Ember from 'ember';

const {Service, computed} = Ember;

export default Service.extend({
	adsContext: computed({
		get() {
			return M.prop('mainPageData.adsContext');
		},
		set(_, value) {
			return value;
		}
	}),

	ns: computed({
		get() {
			return M.prop('mainPageData.details.ns');
		},
		set(_, value) {
			return value;
		}
	}),

	description: computed({
		get() {
			return M.prop('mainPageData.details.description');
		},
		set(_, value) {
			return value;
		}
	}),

	id: computed({
		get() {
			return M.prop('mainPageData.details.id');
		},
		set(_, value) {
			return value;
		}
	})
});
