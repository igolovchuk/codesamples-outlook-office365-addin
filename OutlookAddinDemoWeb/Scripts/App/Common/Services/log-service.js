'use strict';

/**
* @namespace LogService
*/

/**
* The log service.
* @param {Angular.$log}                                      $log                                                The Angular console logging service.
* @param {Scripts.App.Common.Congig.app-values}              $http                                               The logging level allowed list.
* @param {Scripts.App.Common.Services.office-service}        officeService                                       The office service.
* @param {Scripts.App.Common.Services.setting-service}       settingService                                      The setting service.
* @param {Scripts.App.Common.Helpers.security-helper}        securityHelper                                      The security helper.
*/
app.service('logService', ['$log', '$http', 'officeService', 'settingService', 'securityHelper', function ($log, $http, officeService, settingService, securityHelper) {

    /**
    * @private @type {string} The current user hashed identifier value.
    */
    var loginedUserIdHash = securityHelper.getHashedString(HashMethod.sha256, officeService.outlookUserId);

    /**
    * @private @type {string} The current aplpication host identifier value.
    */
    var applicationHost = officeService.appHost;

    /**
    * @private @type {string} The current aplpication platform value.
    */
    var applicationPlatform = officeService.platform;

    /**
    * @private @type {string} The current aplpication version value.
    */
    var applicationVersion = null;

    /**
    * @private @type {object} The app settings logging configuration.
    */
    var loggingConfiguration = null;

    /**
    * Logs data on debug level.
    * @public @memberof LogService
    * @param {string} action                                                                            The executing action.
    * @param {object} logInfo                                                                           The information needed to log.
    */
    this.debug = function (action, logInfo) {
        log(LogLevel.debug, action, logInfo);
    };

    /**
    * Logs data on info level.
    * @public @memberof LogService
    * @param {object} action                                                                            The executing action.
    * @param {object} logInfo                                                                           The information needed to log.
    */
    this.info = function (action, logInfo) {
        log(LogLevel.info, action, logInfo);
    };

    /**
    * Logs data on warning level.
    * @public @memberof LogService
    * @param {object} action                                                                            The executing action.
    * @param {object} logInfo                                                                           The information needed to log.
    */
    this.warn = function (action, logInfo) {
        log(LogLevel.warn, action, logInfo);
    };

    /**
    * Logs data on error level.
    * @public @memberof LogService
    * @param {object} action                                                                            The executing action.
    * @param {object} logInfo                                                                           The information needed to log.
    */
    this.error = function (action, logInfo) {
        log(LogLevel.error, action, logInfo);
    };

    /**
    * Parses cabinet server request result into valid format.
    * @private 
    * @param {Scripts.App.Common.Data.enums.LogLevel}    logLevel                                       The logging info level.
    * @param {object} action                                                                            The executing action.
    * @param {object} data                                                                              The information needed to log.
    * @param {string} clientOnly                                                                        To log only on client side(optional, default - false).
    */
    function log(logLevel, action, data) {
        if (!loggingConfiguration)
            loggingConfiguration = settingService.appSettings && settingService.appSettings.loggingConfiguration;

        if (!applicationVersion)
            applicationVersion = settingService.appSettings && settingService.appSettings.version || Constants.VERSION;

        var logInfo = new LogInfo(logLevel, action, loginedUserIdHash, applicationHost, applicationPlatform, applicationVersion, data);

        logToClient(logInfo);
        logToServer(logInfo);
    }

    /**
    * Logs data to client browser if allowed.
    * @private
    * @param {Scripts.App.Common.Data.models.LogInfo}     logInfo                                        The logging data object.
    */
    function logToClient(logInfo) {
        var isClientLoggingEnabled = !loggingConfiguration
            || loggingConfiguration.clientLoggingEnabled && loggingConfiguration.clientAllowedLevels.indexOf(logInfo.logLevel) >= 0;

        if (isClientLoggingEnabled) {
            switch (logInfo.logLevel) {
                case LogLevel.debug:
                    $log.debug(logInfo);
                    break;
                case LogLevel.info:
                    $log.info(logInfo);
                    break;
                case LogLevel.warn:
                    $log.warn(logInfo);
                    break;
                case LogLevel.error:
                    $log.error(logInfo);
                    break;
            }
        }
    }

    /**
    * Logs data to server endpoint if allowed.
    * @private
    * @param {Scripts.App.Common.Data.models.LogInfo}     logInfo                                        The logging data object.
    */
    function logToServer(logInfo) {
        var isServerLoggingEnabled = !loggingConfiguration
            || loggingConfiguration.serverLoggingEnabled && loggingConfiguration.serverAllowedLevels.indexOf(logInfo.logLevel) >= 0;

        if (isServerLoggingEnabled) {
            var tokenData = settingService.tokenData;

            if (tokenData) {
                var loggingData = { clientLoggingFields: [] };
                Object.keys(logInfo).forEach(function (propertyName) {
                    loggingData.clientLoggingFields.push({
                        key: propertyName,
                        value: typeof logInfo[propertyName] === Constants.TYPE_STRING ? logInfo[propertyName] : JSON.stringify(logInfo[propertyName])
                    });
                });

                $http.post(url, loggingData)
                    .catch(function (error) {
                        logToClient(new LogInfo(LogLevel.warn, 'logService -> logToServer', loginedUserIdHash, applicationHost, applicationPlatform, applicationVersion, error));
                    });
            }
        }
    }
}]);