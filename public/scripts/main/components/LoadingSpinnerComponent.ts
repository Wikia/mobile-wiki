/// <reference path="../app.ts" />
'use strict';

App.LoadingSpinnerComponent = Em.Component.extend({
	classNames: ['loading-spinner'],
	layoutName: 'components/loading-spinner',
	willInsertElement () {
		Em.$('body').addClass('no-scroll');
	},
	didInsertElement () {
		this.$().show();
	},
	willDestroyElement () {
		this.$().fadeOut(this.get('animSpeed'));
		Em.$('body').removeClass('no-scroll');
	}
});
