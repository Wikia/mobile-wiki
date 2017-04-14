import Ember from 'ember';

const {Mixin, on} = Ember;

export default Mixin.create({
	addBodyClassOnActivate: on('activate', function () {
		const controller = this.controllerFor('application');
		const classNames = this.get('applicationWrapperClassNames') || [];
		const applicationWrapperClassNames = controller.get('applicationWrapperClassNames');

		controller.set(
			'applicationWrapperClassNames',
			applicationWrapperClassNames.concat(classNames)
		);
	}),

	removeBodyClassOnDeactivate: on('deactivate', function () {
		const controller = this.controllerFor('application');
		const classNames = this.get('applicationWrapperClassNames') || [];
		const applicationWrapperClassNames = controller.get('applicationWrapperClassNames');

		controller.set(
			'applicationWrapperClassNames',
			applicationWrapperClassNames.filter((item) => {
				return classNames.indexOf(item) === -1;
			})
		);
	})
});
