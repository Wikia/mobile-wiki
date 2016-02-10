import Ember from 'ember';

export default Ember.Component.extend({
	cancelTooltip: i18n.t('app.cancel-label'),
	saveBtnLabel: i18n.t('main.save', {
		ns: 'infobox-builder'
	}),

	headerTitle: Ember.computed('title', function() {
		return i18n.t('main.header', {
			ns: 'infobox-builder',
			title: this.get('title')
		});
	})
});