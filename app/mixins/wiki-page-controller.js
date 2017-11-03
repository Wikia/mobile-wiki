import {inject as service} from '@ember/service';
import {reads} from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	wikiVariables: service(),

	mainPageTitle: reads('wikiVariables.mainPageTitle'),
	siteName: reads('wikiVariables.siteName'),
});
