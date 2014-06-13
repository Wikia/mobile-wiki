/**
 * Adds browser-sync script to the page
 */

document.write(
	"<script defer src='//HOST:3000/socket.io/socket.io.js'><\/script>" +
	"<script defer src='//HOST:3001/client/browser-sync-client.0.9.1.js'><\/script>"
	.replace(/HOST/g, location.hostname)
);
