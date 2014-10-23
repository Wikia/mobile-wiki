/**
 * Utility functions
 */
module Utils {

	/**
	 * Environment types
	 */
	export enum Environment {
		Production,
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
	export function getEnvironment(environment: string, fallbackEnvironment: Environment = Environment.Dev) {
		var environments: {[id: string]: Environment} = {
			production: Environment.Production,
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
	export function getEnvironmentString(environment: Environment): string {
		return Environment[environment].toLowerCase();
	}

	/**
	 * Get domain name for devbox
	 *
	 * @param localSettings
	 * @param wikiSubDomain
	 * @returns {string}
	 */
	function getDomainName(localSettings: LocalSettings, wikiSubDomain: string): string {
		if (localSettings.environment === Environment.Sandbox) {
			return localSettings.host + '.' + wikiSubDomain + '.wikia.com';
		}
		// Devbox
		return wikiSubDomain + '.' + localSettings.mediawikiHost + '.wikia-dev.com';
	}

	/**
	 * @desc Get fallback domain
	 * @returns {string}
	 */
	function getFallbackSubDomain(localSettings: LocalSettings): string {
		return (localSettings.wikiFallback || 'community');
	}

	/**
	 * @desc Generate wiki host name from the request host
	 *
	 * @param hostName
	 * @returns {string}
	 */
	export function getWikiDomainName (localSettings: LocalSettings, hostName: string = ''): string {
		var regex: RegExp,
			match: string[],
			environment = localSettings.environment,
			// For these environments the host name can be passed through
			passThroughEnv: any = {};

		passThroughEnv[Environment.Production] = '%s.wikia.com';
		passThroughEnv[Environment.Verify] = 'verify.%s.wikia.com';
		passThroughEnv[Environment.Preview] = 'preview.%s.wikia.com';

		if (passThroughEnv.hasOwnProperty(environment)) {
			if (hostName) {
				return hostName;
			}
			return passThroughEnv[environment].replace('%s', getFallbackSubDomain(localSettings));
		}

		/**
		 * Capture groups:
		 * 0. "sandbox-*" (if it's the beginning of the url)
		 * 1. The wiki name, including language code (i.e. it could be lastofus or de.lastofus)
		 *    ^ Note: this will match any number of periods in the wiki name, not just one for the language code
		 * We just return capture group 1
		 */
		regex = /^(?:sandbox\-[^\.]+)?\.?(.+?)\.wikia.*\.(?:com|local)$/;
		match = hostName.match(regex);

		return getDomainName(localSettings,  match ? match[1] : getFallbackSubDomain(localSettings));
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
}

export = Utils;
