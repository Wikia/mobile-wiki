import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'header',
	classNames: ['sub-head'],
	classNameBindings: ['fixed'],
	actions: {
		back() {
			this.get('onBackArrowClick')();
		},
		confirm() {
			this.get('onConfirmBtnClick')();
		}
	}
});
