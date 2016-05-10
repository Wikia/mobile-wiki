/**
 * @param {*} application
 *
 * @returns {void}
 */
export function initialize(application) {
	application.deferReadiness();

	$script.ready(['mediaWikiScripts'], () => {
		application.advanceReadiness();
	});
}

export default {
	name: 'wait-for-media-wiki-scripts',
	initialize
};
