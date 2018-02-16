const onHeaders = require('on-headers');
const config = require('../config/fastboot-server');

function setResponseTime(res) {
	const startAt = process.hrtime();

	onHeaders(res, () => {
		const diff = process.hrtime(startAt);
		const timeSec = (diff[0] * 1e3 + diff[1] * 1e-6) / 1000;

		res.setHeader('x-backend-response-time', timeSec.toFixed(3));
	});
}

module.exports = function (req, res, next) {
	res.set('x-served-by', process.env.HOST || process.env.HOSTNAME || 'mobile-wiki');
	// req_id is generated by express-bunyan-logger
	req.headers['x-trace-id'] = req.log.fields.req_id;
	if (req.headers['fastly-ssl']) {
		const cspPolicy = 'default-src https: \'self\' data: blob:; ' +
			'script-src https: \'self\' \'unsafe-inline\' \'unsafe-eval\' blob:; ' +
			'style-src https: \'self\' \'unsafe-inline\' blob:; ';
		const cspReport = `report-uri https://${config.servicesDomain}/csp-logger/csp`;
		res.setHeader('content-security-policy-report-only', cspPolicy + cspReport);
	}
	setResponseTime(res);
	next();
};
