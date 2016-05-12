import Ember from 'ember';
import HeroImageMixin from '../mixins/hero-image';

export default Ember.Controller.extend(HeroImageMixin, {
	application: Ember.inject.controller(),
});
