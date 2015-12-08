import App from '../app';

export default App.FileInputComponent = Ember.Component.extend(
	Ember.Evented,
	{
		reset: false,
		fileInputId: 'fileUpload',

		resetObserver: Ember.observer('reset', function () {
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

			if (!Ember.isEmpty(input.files)) {
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
