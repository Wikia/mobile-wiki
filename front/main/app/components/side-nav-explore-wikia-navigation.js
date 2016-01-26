import Ember from 'ember';

export default Ember.Component.extend({
	links: Ember.get(Mercury, 'wiki.navigation2016.exploreWikiaMenu')
});
