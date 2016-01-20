import Ember from 'ember';
import WidgetScriptStateMixin from '../mixins/widget-script-state';

export default Ember.Component.extend(
	WidgetScriptStateMixin,
	{
		classNames: ['widget-flite'],
		layoutName: 'components/widget-flite',
		data: null
	}
);
