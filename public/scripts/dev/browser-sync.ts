/**
 * Adds browser-sync script to the page
 */

document.write(
	"<script async src='//HOST:3000/browser-sync/browser-sync-client.1.5.1.js'><\/script>"
	.replace(/HOST/g, location.hostname)
);
