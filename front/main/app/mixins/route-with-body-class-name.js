import Ember from 'ember';

const {$, on, Mixin} = Ember;

export default Mixin.create({
	addBodyClassOnActivate: on('activate', function () {
		const $body = $('body'),
			bodyClassNames = this.get('bodyClassNames') || [];

		bodyClassNames.forEach((className) => {
			$body.addClass(className);
		});
	}),

	removeBodyClassOnDeactivate: on('deactivate', function () {
		const $body = $('body'),
			bodyClassNames = this.get('bodyClassNames') || [];

		bodyClassNames.forEach((className) => {
			$body.removeClass(className);
		});
	})
});
