import Ember from 'ember';

const {Mixin, inject} = Ember;

export default Mixin.create({
	fastboot: inject.service(),
	connectionType: 'unresolved',

	init() {
		if (!this.get('fastboot.isFastBoot')) {
			const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
			const effectiveConnectionType = connection.effectiveType || connection.type;

			if (connection && effectiveConnectionType) {
				this.set('connectionType', effectiveConnectionType);
			}
		}
	}
});
