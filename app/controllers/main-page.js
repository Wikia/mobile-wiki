import Controller, {inject as controller} from '@ember/controller';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

export default Controller.extend(WikiPageControllerMixin, {
	application: controller()
});
