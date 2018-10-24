import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  preserveScroll: service(),
  preserveScrollPosition: alias('preserveScroll.preserveScrollPosition'),

  // We're using renderTemplate() to use other controllers than this one,
  // but it doesn't work well with setting query params
  // We need to keep all query params here and set them with this.wikiPage.set()
  queryParams: ['from'],
  from: null
});
