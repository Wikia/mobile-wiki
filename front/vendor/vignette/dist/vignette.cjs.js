/**
 * Helper module to generate the URL to a thumbnail of specific size from JS
 */
'use strict';
var Vignette = (function () {
    function Vignette() {
    }
    /**
     * Converts the URL of a full size image or of a thumbnail into one of a thumbnail of
     * the specified size and returns it
     *
     * @public
     *
     * @param {String} url The URL to the full size image or a thumbnail
     * @param {String} mode The thumbnailer mode, one from Vignette.mode
     * @param {Number} width The width of the thumbnail to fetch
     * @param {Number} height The height of the thumbnail to fetch
     * @param {Object|null} config Optional parameters used for special thumbnail modes
     *
     * @return {String}
     */
    Vignette.getThumbURL = function (url, mode, width, height, config) {
        var urlParameters, sizing = {
            mode: mode,
            width: width,
            height: height,
        };
        // for now we handle only legacy urls as input
        if (this.isLegacyUrl(url)) {
            urlParameters = this.getParametersFromLegacyUrl(url);
            if (mode === Vignette.mode.windowCrop || mode === Vignette.mode.windowCropFixed) {
                if (config && config.xOffset1 && config.yOffset1 && config.xOffset2 && config.yOffset2) {
                    sizing['xOffset1'] = parseInt(config.xOffset1, 10);
                    sizing['yOffset1'] = parseInt(config.yOffset1, 10);
                    sizing['xOffset2'] = parseInt(config.xOffset2, 10);
                    sizing['yOffset2'] = parseInt(config.yOffset2, 10);
                }
                else {
                    throw new Error('Thumbnailer mode `' + mode + '` requires x and y offsets');
                }
            }
            url = this.createThumbnailUrl(urlParameters, sizing);
        }
        return url;
    };
    /**
     * Checks if url points to thumbnailer
     *
     * @public
     *
     * @param {String} url
     *
     * @return {Boolean}
     */
    Vignette.isThumbnailerUrl = function (url) {
        return url && this.imagePathRegExp.test(url);
    };
    /**
     * Checks if url points to legacy thumbnailer
     *
     * @private
     *
     * @param {String} url
     *
     * @return {Boolean}
     */
    Vignette.isLegacyThumbnailerUrl = function (url) {
        return url && this.legacyThumbPathRegExp.test(url);
    };
    /**
     * Checks if url points to legacy image URL
     *
     * @private
     *
     * @param {String} url
     *
     * @return {Boolean}
     */
    Vignette.isLegacyUrl = function (url) {
        return url && this.legacyPathRegExp.test(url);
    };
    /**
     * Removes the thumbnail options part from a thumbnail URL
     *
     * @param {String} url The URL of a thumbnail
     *
     * @return {String} The URL without the thumbnail options
     */
    Vignette.clearThumbOptions = function (url) {
        if (this.isThumbnailerUrl(url)) {
            return url.replace(this.thumbBasePathRegExp, '$1');
        }
        return this.clearLegacyThumbSegments(url.split('/')).join('/');
    };
    /**
     * Gets base domain from url's domain
     *
     * @param {String} fullLegacyDomain
     *
     * @returns {String}
     */
    Vignette.getBaseDomain = function (fullLegacyDomain) {
        return fullLegacyDomain.match(this.getDomainRegExt)[1];
    };
    /**
     * Clear thumb segments from legacy url segments
     *
     * @param {String[]} urlSegments
     *
     * @returns {String[]}
     */
    Vignette.clearLegacyThumbSegments = function (urlSegments) {
        if (urlSegments.indexOf('thumb') > -1) {
            // remove `thumb` and the last segment from the array
            return urlSegments.filter(function (segment) { return segment != 'thumb'; }).slice(0, -1);
        }
        return urlSegments;
    };
    /**
     * Parses legacy image URL and returns object with URL parameters
     *
     * The logic behind handling the legacy URLs:
     *   - the URL is split into segments by `/`;
     *   - first two segments `http://` are removed;
     *   - next segment is the domain name;
     *   - next segment is the cachebuster value with `__cb` in front so we use `substr()`
     *     to get rid of the prefix;
     *   - clearLegacyThumbSegments is called which clears the `thumb` and last segment from
     *     the URL if it is a thumbnail;
     *   - the last three segments are the `imagePath` so we splice them from the array;
     *   - what is left is the `wikiaBucket`, which is the first and the last element of
     *     the array, these get removed from the array;
     *   - what is left in `segments` (if any) are the prefix segments so they go to `pathPrefix`;
     *
     * @private
     *
     * @param {String} url
     *
     * @return {ImageUrlParameters}
     */
    Vignette.getParametersFromLegacyUrl = function (url) {
        var segments = url.split('/'), result = {};
        // Remove protocol
        segments.splice(0, 2);
        result.domain = this.getBaseDomain(segments.shift());
        result.cacheBuster = segments.shift().substr(4);
        segments = this.clearLegacyThumbSegments(segments);
        // Last three segments are the image path
        result.imagePath = segments.splice(-3, 3).join('/');
        // First and last segments form the bucket name
        result.wikiaBucket = [segments.shift(), segments.pop()].join('/');
        // The remaining segments are prefix
        result.pathPrefix = segments.join('/');
        return result;
    };
    /**
     * Constructs complete thumbnailer url
     *
     * @private
     *
     * @param {ImageUrlParameters} urlParameters
     * @param {String} mode
     * @param {Number} width
     * @param {Number} height
     *
     * @return {String}
     */
    Vignette.createThumbnailUrl = function (urlParameters, sizing) {
        var url = [
            'http://vignette.' + urlParameters.domain,
            '/' + urlParameters.wikiaBucket,
            '/' + urlParameters.imagePath,
            '/revision/latest',
            '/' + sizing.mode
        ];
        if (sizing.mode === Vignette.mode.scaleToWidth) {
            url.push('/' + sizing.width);
        }
        else if (sizing.mode === Vignette.mode.windowCrop || sizing.mode === Vignette.mode.windowCropFixed) {
            url.push('/width/' + sizing.width);
            if (sizing.mode === Vignette.mode.windowCropFixed) {
                url.push('/height/' + sizing.height);
            }
            url.push('/x-offset/' + sizing.xOffset1);
            url.push('/y-offset/' + sizing.yOffset1);
            url.push('/window-width/' + (sizing.xOffset2 - sizing.xOffset1));
            url.push('/window-height/' + (sizing.yOffset2 - sizing.yOffset1));
        }
        else {
            url.push('/width/' + sizing.width);
            url.push('/height/' + sizing.height);
        }
        url.push('?cb=' + urlParameters.cacheBuster);
        if (this.hasWebPSupport) {
            url.push('&format=webp');
        }
        if (urlParameters.pathPrefix) {
            url.push('&path-prefix=' + urlParameters.pathPrefix);
        }
        return url.join('');
    };
    Vignette.imagePathRegExp = /\/\/vignette\d?\.wikia/;
    Vignette.thumbBasePathRegExp = /(.*\/revision\/\w+).*/;
    Vignette.legacyThumbPathRegExp = /\/\w+\/thumb\//;
    Vignette.getDomainRegExt = /(wikia-dev.com|wikia.nocookie.net)/;
    Vignette.legacyPathRegExp = /(wikia-dev.com|wikia.nocookie.net)\/__cb[\d]+\/.*$/;
    Vignette.mode = {
        fixedAspectRatio: 'fixed-aspect-ratio',
        fixedAspectRatioDown: 'fixed-aspect-ratio-down',
        scaleToWidth: 'scale-to-width',
        thumbnail: 'thumbnail',
        thumbnailDown: 'thumbnail-down',
        topCrop: 'top-crop',
        topCropDown: 'top-crop-down',
        windowCrop: 'window-crop',
        windowCropFixed: 'window-crop-fixed',
        zoomCrop: 'zoom-crop',
        zoomCropDown: 'zoom-crop-down'
    };
    Vignette.hasWebPSupport = (function () {
        // Image is not defined in node.js
        if (typeof Image === 'undefined') {
            return false;
        }
        // @see http://stackoverflow.com/a/5573422
        var webP = new Image();
        webP.src = 'data:image/webp;' + 'base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = function () {
            Vignette.hasWebPSupport = (webP.height === 2);
        };
        return false;
    })();
    return Vignette;
})();
module.exports = Vignette;
