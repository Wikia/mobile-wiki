import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
	let application,
		attributes = Ember.merge({}, config.APP);

	// use defaults, but you can override;
	attributes = Ember.merge(attributes, attrs);

	Ember.run(() => {
		application = Application.create(attributes);
		application.setupForTesting();
		application.injectTestHelpers();
	});

	return application;
}
