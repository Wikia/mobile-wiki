/**
 * Default localSettings for application
 *
 * var localConfig = require('./config').localSettings
 */
import baseExtendSettingsDev from './localSettings.dev';
import baseExtendSettingsProd from './localSettings.base';

const baseExtendSettings = process.env.WIKIA_ENVIRONMENT === 'dev' ? baseExtendSettingsDev : baseExtendSettingsProd,
	localSettings = baseExtendSettings({
		// Add custom settings here
	});

export default localSettings;
