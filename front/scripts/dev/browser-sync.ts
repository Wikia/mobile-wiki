/**
 * Adds browser-sync script to the page
 */

document.write(
	"<script async src='//HOST:3000/browser-sync/browser-sync-client.js'><\/script>"
	.replace(/HOST/g, location.hostname)
);
