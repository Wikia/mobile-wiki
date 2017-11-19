import {inject as service} from '@ember/service';
import Mixin from '@ember/object/mixin';
import {computed} from '@ember/object';

export default Mixin.create({
	fastboot: service(),
	connection: computed('fastboot.isFastBoot', function () {
		if (!this.get('fastboot.isFastBoot')) {
			return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		}
	}),
	effectiveConnectionType: computed('connection', function () {
		return this.get('connection.effectiveType');
	})
});
