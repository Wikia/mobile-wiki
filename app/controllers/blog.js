import {alias} from '@ember/object/computed';
import Controller, {inject as controller} from '@ember/controller';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

export default Controller.extend(WikiPageControllerMixin, {
	application: controller(),
	article: controller(),
	wikiPage: controller(),

	commentsPage: alias('application.commentsPage')
});
