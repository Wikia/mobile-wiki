import Ember from 'ember';
import {trackMarkAllAsRead} from '../utils/notifications-tracker';

const {Mixin} = Ember;

export default Mixin.create(
	{
		actions: {
			markAllAsRead() {
				trackMarkAllAsRead();
				this.get('notifications').markAllAsRead();
			}
		}
	}
);
