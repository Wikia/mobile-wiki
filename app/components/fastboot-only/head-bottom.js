import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/head-bottom',
	wikiVariables: null,
	isRtl: computed.equal('wikiVariables.language.contentDir', 'rtl')
});
