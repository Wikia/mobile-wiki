import Ember from 'ember';
import WidgetScriptStateMixin from '../mixins/widget-script-state.js';

const WidgetFliteComponent = Ember.Component.extend(
	WidgetScriptStateMixin,
	{
		classNames: ['widget-flite'],
		layoutName: 'components/widget-flite',
		data: null
	}
);

export default WidgetFliteComponent;
