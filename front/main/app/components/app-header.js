import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		back() {
			this.get('onBackArrowClick')();
		},
		confirm() {
			this.get('onConfirmBtnClick')();
		}
	}
});