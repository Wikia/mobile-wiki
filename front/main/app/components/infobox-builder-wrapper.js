import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-preview']
});

window.onbeforeunload = function(event) {
	return i18n.t('infobox-builder:main.leave-confirmation');
};


