import Ember from 'ember';
import config from '../../config/environment';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/body-bottom',
	noExternals: computed.bool('queryParams.noexternals'),
	inContextTranslationsEnabled: config.inContextTranslationsEnabled,
});
