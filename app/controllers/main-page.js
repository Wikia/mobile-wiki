import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

export default Controller.extend(WikiPageControllerMixin, {
  application: controller(),
  wikiVariables: service(),
});
