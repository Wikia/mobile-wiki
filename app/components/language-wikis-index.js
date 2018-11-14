import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  wikiVariables: service(),

  classNames: 'language-wikis-index',
});
