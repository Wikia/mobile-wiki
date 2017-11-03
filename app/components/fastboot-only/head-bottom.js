import Component from '@ember/component';
import {equal} from '@ember/object/computed';

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/head-bottom',
	wikiVariables: null,
	isRtl: equal('wikiVariables.language.contentDir', 'rtl')
});
