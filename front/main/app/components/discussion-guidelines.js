import Ember from 'ember';

export default Ember.Component.extend({
	wikiName: Ember.get(Mercury, 'wiki.siteName'),
});
