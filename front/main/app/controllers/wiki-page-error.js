import Ember from 'ember';

export default Ember.Controller.extend({
	mainPageTitle: Ember.computed(() => {
		return Ember.get(Mercury, 'wiki.mainPageTitle');
	}),

	siteName: Ember.computed(() => {
		return Ember.getWithDefault(Mercury, 'wiki.siteName', 'Fandom powered by  Wikia');
	})
});
