App.FileInputComponent = Ember.Component.extend(Ember.Evented, {
	change(event: Event): void {
		var input: HTMLInputElement = <HTMLInputElement> event.target;
		if (!Em.isEmpty(input.files)) {
			this.sendAction('fileUpload', input.files);
		}
	}
});
