export default Ember.Service.extend(Ember.Evented, {
	isDisplayed: false,
	message: null,

	display(message) {
		if (!this.get('isDisplayed') && message !== this.get('message')) {
			this.setProperties({
				isDisplayed: true,
				message: message,
			});
		}
	},

	close() {
		this.setProperties({
			isDisplayed: false,
			message: null
		});
	}
});
