import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import InfoboxBuilderSidebarOptionsMixin from '../mixins/infobox-builder-sidebar-options';

export default Ember.Component.extend(
	InfoboxBuilderSidebarOptionsMixin,
	InfoboxBuilderEditItemMixin,
	{
		// params required for tracking edit actions
		labelFocusTrackingKey: 'label',
		labelValueOnFocus: null,
		wasLabelAltered: false,

		labelValue: Ember.computed('item.data.label', {
			get() {
				return this.get('item.data.label');
			},
			set(key, value) {
				const item = this.get('item');

				// mark that user interacted with label input
				this.set('wasLabelAltered', true);

				this.get('editRowItem')(item, value);
				return value;
			}
		}),

		inputId: Ember.computed(function() {
			this.createInputId('infoboxRowLabel');
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
