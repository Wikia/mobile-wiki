/// <reference path='../app.ts' />

App.FileInputComponent = Ember.Component.extend(Ember.Evented, {
	reset: false,
	fileInputId: 'fileUpload',

	resetObserver: Em.observer('reset', function (): void {
		if (this.get('reset')) {
			this.$().find('input').val(null);
			this.set('reset', false);
		}
	}),

	change(event: Event): void {
		var input: HTMLInputElement = <HTMLInputElement> event.target;
		if (!Em.isEmpty(input.files)) {
			this.sendAction('fileUpload', input.files);
		}
	}
});
