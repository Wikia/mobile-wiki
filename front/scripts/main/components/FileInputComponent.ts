App.FileInputComponent = Em.Component.extend(
	Em.Evented,
	{
		reset: false,
		fileInputId: 'fileUpload',

		resetObserver: Em.observer('reset', function (): void {
			if (this.get('reset')) {
				this.$().find('input').val(null);
				this.set('reset', false);
			}
		}),

		/**
		 * @param {Event} event
		 * @returns {undefined}
		 */
		change(event: Event): void {
			var input: HTMLInputElement = <HTMLInputElement> event.target;

			if (!Em.isEmpty(input.files)) {
				this.sendAction('fileUpload', input.files);
			}
		},

		/**
		 * @returns {undefined}
		 */
		click(): void {
			this.sendAction('click');
		},
	}
);
