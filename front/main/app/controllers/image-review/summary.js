import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		toggleSummary() {
			this.get('target').send('toggleSummary');
		},

		downloadCSV() {
			this.get('target').send('downloadCSV');
		},

		setStartDate(startDate) {
			this.get('target').send('setStartDate', startDate);
		},

		setEndDate(endDate) {
			this.get('target').send('setEndDate', endDate);
		},

		openImageReview() {
			this.get('target').send('openImageReview');
		}
	}
});
