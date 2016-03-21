import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import InfoboxBuilderSidebarOptionsMixin from '../mixins/infobox-builder-sidebar-options';


export default Ember.Component.extend(
	InfoboxBuilderSidebarOptionsMixin,
	InfoboxBuilderEditItemMixin,
	{
		// params required for tracking edit actions
		headerValueFocusTrackingKey: 'header-value',
		headerValueOnFocus: null,
		wasHeaderValueAltered: false,

		value: Ember.computed('item.data', {
			get() {
				const label = this.get('item.data');

				return (typeof label === 'string' || label instanceof String) ? label : '';
			},
			set(key, value) {
				// check if user interacted with header value input
				this.set('wasHeaderValueAltered', true);

				this.get('editSectionHeaderItem')(this.get('item'), {data: value});
				return value;
			}
		}),

		textInputId: Ember.computed(function () {
			return this.createInputId('infoboxSectionHeader');
		}),

		checkboxInputId: Ember.computed(function () {
			return this.createInputId('isCollapsible');
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
				this.handleInputFocus(
					'headerValueOnFocus',
					this.get('value'),
					this.get('headerValueFocusTrackingKey')
				);
			},

			onHeaderValueInputBlur() {
				this.handleInputBlur(
					'wasHeaderValueAltered',
					this.get('headerValueOnFocus'),
					this.get('value'),
					this.get('headerValueFocusTrackingKey')
				);
			}
		}
	}
);
