import App from '../app';
import WidgetScriptStateMixin from '../mixins/widget-script-state';

App.WidgetFliteComponent = Ember.Component.extend(
	WidgetScriptStateMixin,
	{
		classNames: ['widget-flite'],
		layoutName: 'components/widget-flite',
		data: null
	}
);

export default App.WidgetFliteComponent;
