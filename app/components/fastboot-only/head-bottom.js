import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/head-bottom',
	wikiVariables: inject.service(),
	isRtl: computed.equal('wikiVariables.language.contentDir', 'rtl')
});
