App.FileInputComponent = Ember.Component.extend(Ember.Evented, {
	change(e: Event): void {
		var input: HTMLInputElement = <HTMLInputElement> e.target;
		if (!Em.isEmpty(input.files)) {
			this.sendAction('fileUpload', input.files);
		}
	}
});
