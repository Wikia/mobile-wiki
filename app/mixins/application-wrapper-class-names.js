import Mixin from '@ember/object/mixin';
import { on } from '@ember/object/evented';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  addBodyClassOnActivate: on('activate', function () {
    const controller = this.controllerFor('application');
    const classNames = this.applicationWrapperClassNames || [];
    const applicationWrapperClassNames = controller.applicationWrapperClassNames;

    controller.set(
      'applicationWrapperClassNames',
      applicationWrapperClassNames.concat(classNames),
    );
  }),

  removeBodyClassOnDeactivate: on('deactivate', function () {
    const controller = this.controllerFor('application');
    const classNames = this.applicationWrapperClassNames || [];
    const applicationWrapperClassNames = controller.applicationWrapperClassNames;

    controller.set(
      'applicationWrapperClassNames',
      applicationWrapperClassNames.filter(item => classNames.indexOf(item) === -1),
    );
  }),
});
