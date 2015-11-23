/**
 * localSettings for application, used by default by testing environment
 */
import baseExtendSettingsDev from './localSettings.dev';
import baseExtendSettingsProd from './localSettings.base';
import Utils from '../server/lib/Utils';

const baseExtendSettings = process.env.WIKIA_ENVIRONMENT === 'dev' ? baseExtendSettingsDev : baseExtendSettingsProd,
	localSettings = baseExtendSettings({
		devboxDomain: 'kenneth',
		environment: Utils.Environment.Testing,
		loggers: {
			default: 'info'
		}
	});

export default localSettings;
