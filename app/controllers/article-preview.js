import Controller from '@ember/controller';
import FullPageMixin from '../mixins/full-page';
import PortableInfoboxHeroImageMixin from '../mixins/portable-infobox-hero-image';

export default Controller.extend(
	FullPageMixin,
	PortableInfoboxHeroImageMixin,
	{}
);
