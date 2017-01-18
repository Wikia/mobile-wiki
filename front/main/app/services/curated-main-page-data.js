import Ember from 'ember';

const {Service, computed} = Ember;

export default Service.extend({
	adsContext: computed({
		get() {
			return M.prop('curatedMainPageData.adsContext');
		},
		set(_, value) {
			return value;
		}
	}),

	ns: computed({
		get() {
			return M.prop('curatedMainPageData.details.ns');
		},
		set(_, value) {
			return value;
		}
	}),

	description: computed({
		get() {
			return M.prop('curatedMainPageData.details.description');
		},
		set(_, value) {
			return value;
		}
	}),

	id: computed({
		get() {
			return M.prop('articleId');
		},
		set(_, value) {
			return value;
		}
	})
});
