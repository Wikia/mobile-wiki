import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';

export default Ember.Component.extend(
	InfoboxBuilderEditItemMixin,
	{
		// params required for tracking edit actions
		headerValueFocusTrackingKey: 'header-value',
		headerValueOnFocus: null,
		wasHeaderValueAltered: false,

		value: Ember.computed('item.data', {
			get() {
				return this.get('item.data');
			},
			set(key, value) {
				// check if user interacted with header value input
				this.set('wasHeaderValueAltered', true);

				this.get('editSectionHeaderItem')(this.get('item'), {data: value});
				return value;
			}
		}),

		isCollapsible: Ember.computed('item.collapsible', {
			get() {
				return this.get('item.collapsible');
			},
			set(key, value) {
				this.trackEditItemOption('change', 'collapsible');
				this.get('editSectionHeaderItem')(this.get('item'), {collapsible: value});
				return value;
			}
		}),

		actions: {
			onHeaderValueInputFocus() {
				// save current label value for tracking change on blur
				this.set('headerValueOnFocus', this.get('labelValue'));

				//tack focus on label input
				this.trackEditItemOption('focus', this.get('headerValueFocusTrackingKey'));
			},

			onHeaderValueInputBlur() {
				// track interaction with label input
				if (this.get('wasHeaderValueAltered')) {
					this.trackEditItemOption('keypress', this.get('headerValueFocusTrackingKey'));
					this.set('wasHeaderValueAltered', false);
				}

				// tack change of label value
				if (this.get('headerValueOnFocus') !== this.get('value')) {
					this.trackEditItemOption('change', this.get('headerValueFocusTrackingKey'));
				}
			}
		}
	}
);
