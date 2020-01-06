import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  heroImage: alias('model.heroImage'),

  heroImageInHeader: computed('heroImage', 'model.featuredVideo', function () {
    return !this.get('model.featuredVideo') ? this.heroImage : null;
  }),
});
