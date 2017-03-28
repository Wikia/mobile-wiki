import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/body-bottom',
	noExternals: computed.bool('queryParams.noexternals'),
});
