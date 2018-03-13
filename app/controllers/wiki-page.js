import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
	lightbox: service(),
	preserveScrollPosition: alias('lightbox.preserveScrollPosition')
});
