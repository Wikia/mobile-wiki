import Mixin from '@ember/object/mixin';
import {trackMarkAllAsRead} from '../utils/notifications-tracker';

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
