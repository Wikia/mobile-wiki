import Ember from 'ember';

const {Mixin, inject, computed} = Ember;

export default Mixin.create({
	fastboot: inject.service(),
	connection: computed('fastboot.isFastBoot', function() {
		if (!this.get('fastboot.isFastBoot')) {
			return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		} else {
			return 'unresolved';
		}
	}),
	effectiveConnectionType: computed('connection', function() {
		return this.get('connection.effectiveType') || this.get('connection.type');
	})
});
