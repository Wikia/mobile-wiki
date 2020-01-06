import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  wikiVariables: service(),

  mainPageTitle: reads('wikiVariables.mainPageTitle'),
  siteName: reads('wikiVariables.siteName'),
});
