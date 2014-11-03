/// <reference path="../../../typings/jquery/jquery.d.ts" />
declare var FastClick: any;
// Private initialization
module Mercury {
	// FastClick disables the 300ms delay on iOS and some Android devices. It also uses clicks so that
	// elements have access to :hover state
	// TODO: don't bind FastClick on desktop
	jQuery(() => {
		FastClick.attach(document.body);
	});
}
