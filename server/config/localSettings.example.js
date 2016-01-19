import baseExtendSettingsDev from './localSettings.dev';
import baseExtendSettingsProd from './localSettings.base';

const wikiaEnvironment = process.env.WIKIA_ENVIRONMENT || 'dev',
	baseExtendSettings = wikiaEnvironment === 'dev' ? baseExtendSettingsDev : baseExtendSettingsProd,
	localSettings = baseExtendSettings({
		// Add custom settings here
	});

export default localSettings;
