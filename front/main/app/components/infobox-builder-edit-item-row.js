import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';

export default Ember.Component.extend(
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

				// check if user interacted with label input
				this.set('wasLabelAltered', true);

				this.get('editRowItem')(item, value);
				return value;
			}
		}),

		actions: {
			onLabelInputFocus() {
				// save current label value for tracking change on blur
				this.set('labelValueOnFocus', this.get('labelValue'));

				//tack focus on label input
				this.trackEditItemOption('focus', this.get('labelFocusTrackingKey'));
			},

			onLabelInputBlur() {
				// track interaction with label input
				if (this.get('wasLabelAltered')) {
					this.trackEditItemOption('keypress', this.get('labelFocusTrackingKey'));
					this.set('wasLabelAltered', false);
				}

				// tack change of label value
				if (this.get('labelValueOnFocus') !== this.get('labelValue')) {
					this.trackEditItemOption('change', this.get('labelFocusTrackingKey'));
				}
			}
		}
	}
);
