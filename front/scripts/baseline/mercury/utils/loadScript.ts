/// <reference path='../../mercury.ts' />
/// <reference path='../../mercury.d.ts' />

module Mercury.Utils {
	function loadError (error: ErrorEvent): void {
		var scriptTag: HTMLScriptElement = <HTMLScriptElement> error.target;
		throw new URIError('The script ' + scriptTag.src + ' is not accessible.');
	}

	export function loadScript(src: string, fOnload: any) {
		var script = document.createElement('script');
		script.type = 'text\/javascript';
		script.onerror = loadError;
		if (fOnload) {
			script.onload = fOnload;
		}
		document.body.appendChild(script);
		script.src = src;
	}
}
