import Component from '@ember/component';
import {equal} from '@ember/object/computed';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
	wikiVariables: service(),
	tagName: '',
	layoutName: 'components/fastboot-only/head-bottom',


	isRtl: equal('wikiVariables.language.contentDir', 'rtl'),
});
