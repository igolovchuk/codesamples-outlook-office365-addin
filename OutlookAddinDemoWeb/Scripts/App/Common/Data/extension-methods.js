'use strict';

/**
* Converts the value of objects to strings based on the formats specified and inserts them into another string.
* @public @static
* @param {string} format                      The input string with template.
* @return {string}                            The formatted string.
*/
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] !== 'undefined'
                                       ? args[number] 
                                       : match;
        });
    };
}

/**
* Crops the text to specified length.
* @public @static
* @param {string} text                         The text needed to crop.
* @param {number} maxLength                    The length to crop.
* @return {string}                             The cropped text.
*/
if (!String.crop) {
    String.crop = function (text, maxLength) {
        if (text && text.length > maxLength) {
            text = text.substring(0, maxLength);
        }

        return text;
    };
}

/**
* Determines if string is JSON or not.
* @public @static
* @param {string} string                       The source string.
* @return {boolean}                            True if string is JSON, otherwise - false.
*/
if (!String.isJson) {
    String.isJson = function (string) {
        try {
            JSON.parse(string);
        } catch(e) {
            return false;
        }

        return true;
    };
}


/**
* Creates date string with specified format.
* @public @static @extension
* @param {string} template                      The template format.
* @param {boolean} useUtc                       If need to use UTC format.
* @return {string}                              The date string in specified format.
*/
if (!Date.prototype.formatDate) {
    Date.prototype.formatDate = function (template, useUtc) {
        var date = this;

        // The template pattern configuration.
        var patternConfig = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            prependZero = function (value, length) {
                value = String(value);
                length = length || 2;
                while (value.length < length) value = '0' + value;
                return value;
            };

        // Some common format strings.
        var templates = {
            default: 'ddd mmm dd yyyy HH:MM:ss',
            shortDate: 'm/d/yy',
            mediumDate: 'mmm d, yyyy',
            longDate: 'mmmm d, yyyy',
            fullDate: 'dddd, mmmm d, yyyy',
            shortTime: 'h:MM TT',
            mediumTime: 'h:MM:ss TT',
            longTime: 'h:MM:ss TT Z',
            isoDate: 'yyyy-mm-dd',
            isoTime: 'HH:MM:ss',
            isoDateTime: 'yyyy-mm-dd\'T\'HH:MM:ss',
            isoUtcDateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\''
        };

        // Internationalization strings.
        var interStrings = {
            dayNames: [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ],
            monthNames: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ]
        };

        // You can't provide utc if you skip other args (use the 'UTC:' template prefix).
        if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
            template = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary.
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError('Invalid date');

        template = String(templates[template] || template || templates['default']);

        // Allow setting the UTC argument via the template.
        var utcArgument = 'UTC:';
        if (template.slice(0, utcArgument.length) === utcArgument) {
            template = template.slice(utcArgument.length);
            useUtc = true;
        }

        var getMethod = useUtc ? 'getUTC' : 'get',
            d = date[getMethod + 'Date'](),
            D = date[getMethod + 'Day'](),
            m = date[getMethod + 'Month'](),
            y = date[getMethod + 'FullYear'](),
            H = date[getMethod + 'Hours'](),
            M = date[getMethod + 'Minutes'](),
            s = date[getMethod + 'Seconds'](),
            L = date[getMethod + 'Milliseconds'](),
            o = useUtc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: prependZero(d),
                ddd: interStrings.dayNames[D],
                dddd: interStrings.dayNames[D + 7],
                m: m + 1,
                mm: prependZero(m + 1),
                mmm: interStrings.monthNames[m],
                mmmm: interStrings.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: prependZero(H % 12 || 12),
                H: H,
                HH: prependZero(H),
                M: M,
                MM: prependZero(M),
                s: s,
                ss: prependZero(s),
                l: prependZero(L, 3),
                L: prependZero(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? 'a' : 'p',
                tt: H < 12 ? 'am' : 'pm',
                T: H < 12 ? 'A' : 'P',
                TT: H < 12 ? 'AM' : 'PM',
                Z: useUtc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                o: (o > 0 ? '-' : '+') + prependZero(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
            };

        return template.replace(patternConfig, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}

/**
* Adds days to specific date.
* @public @static @extension
* @param {number} days                      The count of days to add.
* @return {date}                            The date with added days.
*/
if (!Date.prototype.addDays) {
    Date.prototype.addDays = function (days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };
}

/**
* Adds minutes to specific date.
* @public @static @extension
* @param {number} minutes                   The count of minutes to add.
* @return {date}                            The date with added minutest.
*/
if (!Date.prototype.addMinutes) {
    Date.prototype.addMinutes = function (minutes) {
        return new Date(this.getTime() + parseInt(minutes) * 60 * 1000);
    };
}