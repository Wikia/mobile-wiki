import Component from '@ember/component';
import {bool} from '@ember/object/computed';
import config from '../../config/environment';

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/body-bottom',
	noExternals: bool('queryParams.noexternals'),
	inContextTranslationsEnabled: config.inContextTranslationsEnabled,
});
