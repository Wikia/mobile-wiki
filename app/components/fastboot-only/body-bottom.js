import Component from '@ember/component';
import {bool, equal} from '@ember/object/computed';
import config from '../../config/environment';

export default Component.extend({
	tagName: '',
	wikiVariables: null,
	layoutName: 'components/fastboot-only/body-bottom',
	noExternals: bool('queryParams.noexternals'),
	isRtl: equal('wikiVariables.language.contentDir', 'rtl'),
	inContextTranslationsEnabled: config.inContextTranslationsEnabled
});
