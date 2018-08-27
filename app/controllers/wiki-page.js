import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
	preserveScroll: service(),
	preserveScrollPosition: alias('preserveScroll.preserveScrollPosition'),
});
