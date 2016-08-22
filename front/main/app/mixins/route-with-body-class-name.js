import Ember from 'ember';

const {$, on, Mixin} = Ember;

export default Mixin.create({
	addBodyClassOnActivate: on('activate', function () {
		const bodyClassNames = this.get('bodyClassNames') || [];

		$('body').addClass(bodyClassNames.join(' '));
	}),

	removeBodyClassOnDeactivate: on('deactivate', function () {
		const bodyClassNames = this.get('bodyClassNames') || [];

		$('body').removeClass(bodyClassNames.join(' '));
	})
});
