'use strict';

/**
* @namespace UrlHelper
*/

/**
* The URL helper.
*  @param {Angular.$window}                                          $window                                The Angular window service.
*  @returns {object}                                                                                        The URL helper factory object.
*/
app.factory('urlHelper', ['$window', function ($window) {
    return {
        /**
        * Parses query URL into key value array.
        * @param {string} url             The URL address.
        * @return {object}                The response or promise.
        */
        parseQueryString: function (url) {
            var data = {};

            url.replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function ($0, $1, $2, $3) { data[$1] = $3; }
            );

            return data;
        },

        /**
        * Transforms query object into string concatenation parameters.
        * @param {object} source          The object source.
        * @return {string}                The query string.
        */
        queryParams: function (source) {
            var array = [];

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
                }
            }

            return array.join("&");
        },

        /**
        * Transforms URL string into URL object(IE support).
        * @param {string} url             The URL address.
        * @return {object}                The URL object.
        */
        getUrlObject: function (url) {
            if (url) {
                url = url.replace(Constants.API_PREFIX, Constants.EMPTY_STRING);

                var regexUrlInformation = new RegExp([
                    '^(https?:)//', // protocol
                    '(([^:/?#]*)(?::([0-9]+))?)', // host (host name and port).
                    '(/{0,1}[^?#]*)', // Pathname.
                    '(\\?[^#]*|)', // Search.
                    '(#.*|)$' // Hash.
                ].join(Constants.EMPTY_STRING));

                var match = url.match(regexUrlInformation);

                return match &&
                {
                    href: url,
                    protocol: match[1],
                    host: match[2],
                    hostName: match[3],
                    port: match[4],
                    pathName: match[5],
                    search: match[6],
                    hash: match[7]
                };
            }

            return url;
        },

        /**
        * Gets base path for index page.
        * @return {string}                The base path for index page.
        */
        getBasePath: function () {
            return $window.location.origin + $window.location.pathname;
        },

        /**
        * Transforms URL string into encoded url string with fixed encoding.
        * @param {string} url             The URL address.
        * @return {string}                The encoded URL string.
        */
        fixedEncodeURIComponent: function(url) {
            return encodeURIComponent(url).replace(/[!'()*]/g, function (c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); });
        }
    };
}]);