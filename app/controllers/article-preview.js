import Ember from 'ember';
import FullPageMixin from '../mixins/full-page';
import PortableInfoboxHeroImageMixin from '../mixins/portable-infobox-hero-image';

export default Ember.Controller.extend(
	FullPageMixin,
	PortableInfoboxHeroImageMixin,
	{}
);
