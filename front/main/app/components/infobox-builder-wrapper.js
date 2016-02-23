import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-preview']
});

$( window ).on('beforeunload', function() {
	return "Are you sure to leave this page? Changes will be lost.";
});

