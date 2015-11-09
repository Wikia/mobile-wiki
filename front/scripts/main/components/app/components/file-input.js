App.FileInputComponent = Em.Component.extend(
	Em.Evented,
	{
		reset: false,
		fileInputId: 'fileUpload',

		resetObserver: Em.observer('reset', function () {
			if (this.get('reset')) {
				this.$().find('input').val(null);
				this.set('reset', false);
			}
		}),

		/**
		 * @param {Event} event
		 * @returns {void}
		 */
		change(event) {
			const input = event.target;

			if (!Em.isEmpty(input.files)) {
				this.sendAction('fileUpload', input.files);
			}
		},

		/**
		 * @returns {void}
		 */
		click() {
			this.sendAction('click');
		},
	}
);
