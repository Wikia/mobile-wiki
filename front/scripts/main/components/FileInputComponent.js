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
		 * @returns {void}
		 */
		change(event: Event): void {
			var input: HTMLInputElement = <HTMLInputElement> event.target;

			if (!Em.isEmpty(input.files)) {
				this.sendAction('fileUpload', input.files);
			}
		},

		/**
		 * @returns {void}
		 */
		click(): void {
			this.sendAction('click');
		},
	}
);
