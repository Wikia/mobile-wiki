/// <reference path="../app.ts" />
'use strict';

App.LoadingSpinnerComponent = Em.Component.extend({
	classNames: ['loading-spinner'],
	layoutName: 'components/loading-spinner',
	willInsertElement () {
		Ember.$('body').addClass('no-scroll');
	},
	didInsertElement () {
		this.$().show();
	},
	willDestroyElement () {
		this.$().fadeOut(this.get('animSpeed'));
		Ember.$('body').removeClass('no-scroll');
	}
});
