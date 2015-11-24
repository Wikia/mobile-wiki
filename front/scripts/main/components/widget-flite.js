import App from '../app';
import WidgetScriptStateMixin from '../mixins/widget-script-state';

export default App.WidgetFliteComponent = Ember.Component.extend(
	WidgetScriptStateMixin,
	{
		classNames: ['widget-flite'],
		layoutName: 'components/widget-flite',
		data: null
	}
);
