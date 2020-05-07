'use strict';

/**
* @namespace NotificationService
*/

/**
* The notification service.
* @param {Scripts.App.Common.Services.time-service}  timeService                       The time management service.
* @param {Scripts.App.Common.Services.time-service}  officeService                     The office service.
*/
app.service('notificationService', ['timeService', 'officeService', function (timeService, officeService) {

    /**
    * @private @type {Angular.$controller} The context where need to show notification.
    */
    var uiContext = null;

    /**
    * @private @type {object}                                                                   The notification showing cancellation token source.
    */
    var notificationCancellationTokenSource = null;

    /**
    * Initializes data that is required for proper work of service.
    * @public
    * @param {Angular.$controller} context                                              The context where need to show notification.
    */
    this.initialize = function (context) {
        uiContext = context;
    };

    /**
    * Shows notification about filing result on UI.
    * @public
    * @param {Scripts.App.Common.Data.enums.FilingStatus} filingStatus                  The filing status.
    */
    this.showFilingNotification = function (filingStatus) {
        switch (filingStatus) {
            case FilingStatus.succeeded:
                this.showSuccessfulNotification(Constants.FILING_NOTIFICATION_SUCCESS, Constants.NOTIFICATION_SUCCESS_FADEOUT_TIME, null, null);
                break;
            case FilingStatus.active:
                var subtext, action = null;

                if (officeService.isMobile) {
                    subtext = Constants.FILING_NOTIFICATION_IN_PROGRESS_SUB_TEXT;
                    action = officeService.closeAddin;
                }

                this.showInfoNotification(Constants.FILING_NOTIFICATION_IN_PROGRESS, Constants.NOTIFICATION_NO_FADEOUT, subtext, action);
                break;
            case FilingStatus.failed:
                this.showErrorNotification(Constants.FILING_NOTIFICATION_ERROR, Constants.NOTIFICATION_ERROR_FADEOUT_TIME, null, null);
                break;
        }
    };

    /**
    * Shows notification about final filing result on UI.
    * @public
    * @param {boolean} isSuccess                                                         If filing result is successful.
    */
    this.showFinalFilingNotification = function (isSuccess) {
        if (isSuccess) {
            this.showSuccessfulNotification(Constants.FILING_NOTIFICATION_SUCCESS, Constants.NOTIFICATION_SUCCESS_FADEOUT_TIME, null, null);
        }
        else {
            this.showErrorNotification(Constants.FILING_NOTIFICATION_ERROR, Constants.NOTIFICATION_ERROR_FADEOUT_TIME, null , null);
        }
    };

    /**
    * Shows successful notification on UI.
    * @public
    * @param {string} text                                                              The notification text.
    * @param {number} fadeoutTime                                                       The notification fade out time (optional).
    * @param {number} subText                                                           The notification sub text (optional).
    * @param {number} action                                                            The notification action for sub text (optional).
    */
    this.showSuccessfulNotification = function (text, fadeoutTime, subText, action) {
        this.showNotification(NotificationType.success,
                              text,
                              String.format(Constants.IMAGE_TEMPLATE, NotificationType.success, Constants.ICON_TYPE_SVG),
                              true,
                              fadeoutTime,
                              subText,
                              action);
    };

    /**
    * Shows warning notification on UI.
    * @public
    * @param {string} text                                                              The notification text.
    * @param {number} fadeoutTime                                                       The notification fade out time (optional).
    * @param {number} subText                                                           The notification sub text (optional).
    * @param {number} action                                                            The notification action for sub text (optional).
    */
    this.showWarningNotification = function (text, fadeoutTime, subText, action) {
        this.showNotification(NotificationType.warning,
                              text,
                              String.format(Constants.IMAGE_TEMPLATE, NotificationType.warning, Constants.ICON_TYPE_SVG),
                              false,
                              fadeoutTime,
                              subText,
                              action);
    };

    /**
    * Shows information notification on UI.
    * @public
    * @param {string} text                                                              The notification text.
    * @param {number} fadeoutTime                                                       The notification fade out time (optional).
    * @param {number} subText                                                           The notification sub text (optional).
    * @param {number} action                                                            The notification action for sub text (optional).
    */
    this.showInfoNotification = function (text, fadeoutTime, subText, action) {
        this.showNotification(NotificationType.info,
                              text,
                              String.format(Constants.IMAGE_TEMPLATE, NotificationType.info, Constants.ICON_TYPE_SVG),
                              false,
                              fadeoutTime,
                              subText,
                              action);
    };

    /**
    * Shows error notification on UI.
    * @public
    * @param {string} text                                                              The notification text.
    * @param {number} fadeoutTime                                                       The notification fade out time (optional).
    * @param {number} subText                                                           The notification sub text (optional).
    * @param {number} action                                                            The notification action for sub text (optional).
    */
    this.showErrorNotification = function (text, fadeoutTime, subText, action) {
        this.showNotification(NotificationType.error,
                              text,
                              String.format(Constants.IMAGE_TEMPLATE, NotificationType.error, Constants.ICON_TYPE_SVG),
                              true,
                              fadeoutTime,
                              subText,
                              action);
    };

    /**
    * Shows notification on UI.
    * @public
    * @param {Scripts.App.Common.Data.enums.NotificationType} type                      The notification type.
    * @param {string} text                                                              The notification text.
    * @param {string} icon                                                              The notification icon.
    * @param {boolean} invertCloseButton                                                If need to invert close button color to white (optional).
    * @param {number} fadeoutTime                                                       The notification fade out time (optional).
    * @param {number} subText                                                           The notification sub text (optional).
    * @param {number} action                                                            The notification action for sub text (optional).
    */
    this.showNotification = function (type, text, icon, invertCloseButton, fadeoutTime, subText, action) {

        if (uiContext && type && text) {

            if (!fadeoutTime)
                fadeoutTime = Constants.NOTIFICATION_DEFAULT_FADEOUT_TIME;

            uiContext.notificationType = type;
            uiContext.notificationText = text;
            uiContext.notificationSubText = subText;
            uiContext.notificationAction = action;
            uiContext.notificationIcon = icon;
            uiContext.notificationFadeoutTime = fadeoutTime;
            uiContext.notificationCloseIcon = invertCloseButton
                                              ? Constants.NOTIFICATION_CLOSE_ICON_WHITE
                                              : Constants.NOTIFICATION_CLOSE_ICON_BLACK;

            uiContext.showNotification = true;

            if (fadeoutTime !== Constants.NOTIFICATION_NO_FADEOUT) {

                if (notificationCancellationTokenSource) {
                    notificationCancellationTokenSource.cancel();
                }

                notificationCancellationTokenSource = new CancellationTokenSource();

                timeService.delay(function () {
                    uiContext.showNotification = uiContext.notificationFadeoutTime === Constants.NOTIFICATION_NO_FADEOUT;
                }, fadeoutTime, notificationCancellationTokenSource);
            }
        }
    };

    /**
    * Hides notifications that can be currently shown.
    * @public
    */
    this.hideNotifications = function () {
        uiContext.showNotification = false;
    };
}]);