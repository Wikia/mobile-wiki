import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import InfoboxBuilderSidebarOptionsMixin from '../mixins/infobox-builder-sidebar-options';
import InfoboxBuilderInputAutoFocusMixin from '../mixins/infobox-builder-input-auto-focus';


export default Ember.Component.extend(
	InfoboxBuilderSidebarOptionsMixin,
	InfoboxBuilderEditItemMixin,
	InfoboxBuilderInputAutoFocusMixin,
	{
		// params required for tracking edit actions
		labelFocusTrackingKey: 'label',
		labelValueOnFocus: null,
		wasLabelAltered: false,

		labelValue: Ember.computed('item.data.label', {
			get() {
				const label = this.get('item.data.label');

				return (typeof label === 'string' || label instanceof String) ? label : '';
			},
			set(key, value) {
				const item = this.get('item');

				// mark that user interacted with label input
				this.set('wasLabelAltered', true);

				this.get('editRowItem')(item, value);
				return value;
			}
		}),

		inputId: Ember.computed(function () {
			return this.createInputId('infoboxRowLabel');
		}),

		actions: {
			onLabelInputFocus() {
				this.handleInputFocus(
					'labelValueOnFocus',
					this.get('labelValue'),
					this.get('labelFocusTrackingKey')
				);
			},

			onLabelInputBlur() {
				this.handleInputBlur(
					'wasLabelAltered',
					this.get('labelValueOnFocus'),
					this.get('labelValue'),
					this.get('labelFocusTrackingKey')
				);
			}
		}
	}
);
