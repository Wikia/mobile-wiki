/**
 * Utility functions
 */
module Utils {

	/**
	 * Environment types
	 */
	export enum Environment {
		Prod,
		Verify,
		Preview,
		Sandbox,
		Dev,
		Testing
	}

	/**
	 * @desc Get environment from string
	 *
	 * @param {string} environment Environment name
	 * @param {Environment} fallbackEnvironment Fallback environment
	 * @returns {Environment}
	 */
	export function getEnvironment (environment: string, fallbackEnvironment: Environment = Environment.Dev) {
		var environments: {[id: string]: Environment} = {
			// TODO: Remove `production` environment once all changes are propagated
			production: Environment.Prod,

			prod: Environment.Prod,
			verify: Environment.Verify,
			preview: Environment.Preview,
			sandbox: Environment.Sandbox,
			dev: Environment.Dev,
			testing: Environment.Testing
		};
		if (environments.hasOwnProperty(environment)) {
			return environments[environment];
		}
		return fallbackEnvironment;
	}

	/**
	 * @desc Get environment as string
	 *
	 * @param {Environment} environment
	 * @return {string}
	 */
	export function getEnvironmentString (environment: Environment): string {
		return Environment[environment].toLowerCase();
	}

	/**
	 * Get domain name for devbox or sandbox
	 *
	 * @param localSettings
	 * @param wikiSubDomain
	 * @returns {string}
	 */
	function getFallbackDomain (localSettings: LocalSettings, wikiSubDomain: string): string {
		if (localSettings.environment === Environment.Sandbox) {
			return localSettings.host + '.' + wikiSubDomain + '.wikia.com';
		}
		// This is specific to the devbox setup
		// Curl requests will look like muppet.devname.wikia-dev.com so skip the "devname"
		// Web requests will look like muppet.123.123.123.123.xip.io so add the "devname"
		if (localSettings.devboxDomain && wikiSubDomain.indexOf(localSettings.devboxDomain) == -1) {
			return wikiSubDomain + '.' + localSettings.devboxDomain + '.wikia-dev.com';
		} else {
			return wikiSubDomain + '.wikia-dev.com';
		}
	}

	/**
	 * @desc Get fallback domain
	 * @returns {string}
	 */
	function getFallbackWiki (localSettings: LocalSettings): string {
		return (localSettings.wikiFallback || 'community');
	}

	/**
	 * @desc Generate wiki host name from the request host
	 *
	 * @param localSettings
	 * @param hostName
	 * @returns {string}
	 */
	export function getWikiDomainName (localSettings: LocalSettings, hostName: string = ''): string {
		var regex: RegExp,
			match: string[],
			environment = localSettings.environment,
			// For these environments the host name can be passed through
			passThroughEnv: any = {};

		passThroughEnv[Environment.Prod] = '%s.wikia.com';
		passThroughEnv[Environment.Verify] = 'verify.%s.wikia.com';
		passThroughEnv[Environment.Preview] = 'preview.%s.wikia.com';

		if (passThroughEnv.hasOwnProperty(environment)) {
			if (hostName) {
				return hostName;
			}
			// This fallback is just for mediawikiDomain var in ServerData::createServerData
			return passThroughEnv[environment].replace('%s', getFallbackWiki(localSettings));
		}

		/**
		 * Dynamic environments (sandbox or devbox)
		 * Capture groups:
		 * 0. "sandbox-*" (if it's the beginning of the url)
		 * 1. The wiki name, including language code (i.e. it could be lastofus or de.lastofus)
		 *    ^ Note: this will match any number of periods in the wiki name, not just one for the language code
		 *    ^ Note: on the devbox this will match wikiname.devboxname
		 * We just return capture group 1
		 */
		regex = /^(?:sandbox\-[^\.]+)?\.?(.+?)\.(wikia.*|(?:[\d]{1,3}\.){3}[\d]{1,3}\.xip)\.(?:com|local|io)$/;
		match = hostName.match(regex);

		return getFallbackDomain(localSettings,  match ? match[1] : getFallbackWiki(localSettings));
	}

	/**
	 * @desc Removes the port from hostname
	 *
	 * @param {string} host
	 * @returns {string}
	 */
	export function clearHost (host: string): string {
		return host.split(':')[0]; //get rid of port
	}

	/**
	 * @desc Get vertical color from localSettings
	 *
	 * @param {LocalSettings} localSettings
	 * @param {string} vertical
	 * @return {string}
	 */
	export function getVerticalColor (localSettings: LocalSettings, vertical: string): string {
		if (localSettings.verticalColors.hasOwnProperty(vertical)) {
			return localSettings.verticalColors[vertical];
		}
		return null;
	}
}

export = Utils;
