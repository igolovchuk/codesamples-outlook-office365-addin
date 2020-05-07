'use strict';

/**
* @namespace ItemController
*/

/**
* Application item controller.
* @param {Scripts.App.Common.Services.office-service}               officeService                          The office service.
* @param {Scripts.App.Common.Services.cabinet-service}              cabinetService                         The cabinet service.
* @param {Scripts.App.Common.Services.navigation-service}           navigationService                      The navigation service.
* @param {Scripts.App.Common.Services.prediction-service}           predictionService                      The prediction service.
* @param {Scripts.App.Common.Services.auth-service}                 authService                            The authentication service.
* @param {Scripts.App.Common.Services.filing-service}               filingService                          The filing service.
* @param {Scripts.App.Common.Services.notification-service}         notificationService                    The notification service.
* @param {Scripts.App.Common.Services.time-service}                 timeService                            The time management service.
* @param {Scripts.App.Common.Services.access-service}               searchService                          The quick search service.
* @param {Scripts.App.Common.Services.log-service}                  logService                             The logging service.
* @param {Scripts.App.Common.Helpers.error-helper}                  errorHelper                            The error helper.
*/
app.controller('itemController', ['officeService', 'cabinetService', 'navigationService', 'predictionService', 'authService', 'filingService',
                                  'notificationService', 'timeService', 'searchService', 'logService', 'errorHelper',
                                  function (officeService,
                                            cabinetService,
                                            navigationService,
                                            predictionService,
                                            authService,
                                            filingService,
                                            notificationService,
                                            timeService,
                                            searchService,
                                            logService,
                                            errorHelper)
{
    /**
    * @private @type {Angular.$controller} The main context.
    */
    var context = this;

    /**
    * @private @type {Scripts.App.Common.Data.outlook-item} The active outlook item.
    */
    var outlookItem = null;

    /**
    * @private @type {Scripts.App.Common.Data.models.CancellationTokenSource} The cancellation token source.
    */
    var itemChangedCancellationTokenSource = new CancellationTokenSource();

    /**
    * @public @type {boolean} Determines if access dialog is open.
    */
    context.isAccessDialogOpen = false;

    /**
    * @public @type {boolean} Determines if about dialog is open.
    */
    context.isAboutDialogOpen = false;

    /**
    * @public @type {boolean} Determines if rename subject dialog is open.
    */
    context.isRenameSubjectDialogOpen = false;

    /**
    * @public @type {boolean} Determines if application data is loaded.
    */
    context.isApplicationDataLoaded = false;

    /**
    * @public @type {boolean} Determines if settings menu is open.
    */
    context.isSettingsMenuOpen = false;

    /**
    * @public @type {boolean} Determines if refresh is enabled.
    */
    context.isRefreshEnabled = false;

    /**
    * @public @type {boolean} Determines if search edit is enabled.
    */
    context.isSearchEnabled = false;

    /**
    * @public @type {boolean} Determines if search operation is in progress.
    */
    context.isSearchInProgress = false;

    /**
    * @public @type {boolean} Determines if search control is active.
    */
    context.isSearchActive = false;

    /**
    * @public @type {boolean} Determines if file button is enabled.
    */
    context.isFileButtonEnabled = false;

    /**
    * Initializes all data.
    * @public 
    */
    context.initializeData = function () {
        officeService.addItemChangedHandlerAsync(onItemChanged);
        notificationService.initialize(context);
        filingService.initialize(onFilingTaskStatusReceived, onFilingTrackingStatusReceived);

        var activeItem = officeService.activeItem;

        if (activeItem && officeService.isSupportedItem(activeItem.itemClass)) {
            logService.debug('itemCtrl -> initializeData');

            outlookItem = new OutlookItem(activeItem);
            context.customSubject = new OutlookItemSubject(outlookItem);
            context.validatedSubjectValue = context.customSubject.filingValue;

            timeService.cancelAfter(outlookItem.initializeAsync, Constants.OUTLOOK_ITEM_INITIALIZATION_TIMEOUT)
                       .then(() => {
                                   filingService.startTrackingStatus(outlookItem);
                                   context.loadDataAsync();
                       });
        }
        else {
            displayMessageOnPanel({ text: Constants.UNDEFINED_OUTLOOK_ITEM });
            logService.error('itemCtrl -> initializeData', Constants.UNDEFINED_OUTLOOK_ITEM);
        }
    };

    /**
    * The cabinet changed event handler.
    * @public
    * @param {string} currentCabinetId                                The current cabinet identifier.
    */
    context.cabinetChanged = function (currentCabinetId) {
        logService.debug('itemCtrl -> cabinetChanged', currentCabinetId);

        clearSearchData();
        refreshPredictions(currentCabinetId);
        cabinetService.setUserDefaultCabinetIdAsync(currentCabinetId);
    };

    /**
    * Makes search call.
    * @public
    * @param {string} queryText                                        The query text.
    * @param {number} minInputLength                                   The minimum input length to execute search.
    */
    context.search = function (queryText, minInputLength) {
        if (!minInputLength) minInputLength = 1;

        var validatedText = queryText && queryText.trim();

        if (validatedText && validatedText.length >= minInputLength) {
            context.isCabinetDropdownEnabled = false;

            context.isSearchInProgress = true;
            clearSearchData();

            searchService.loadQuickSearchLocationsAsync(context.cabinetData.currentCabinetId, validatedText)
                         .then(setQuickSearchDataOnUi)
                         .catch(handleChainErrors);
        }
    };

    /**
    * Adds or updates location to/on prediction panel.
    * @public
    * @param {object} locationData                                        The location data.
    */
    context.addSearchLocation = function (locationData) {
        if (!context.predictionData) {
            context.predictionData = new PredictionData();
        }

        context.predictionData.upsertLocation(locationData);

        closeSearchContainer();
        context.isFileButtonEnabled = predictionPanelContainsChanges();
    };

  
    /**
    * The save access state event handler.
    * @public
    * @param {Scripts.App.Common.Config.app-values.fileAccessList} accessList                                           The access list to save.
    */
    context.submitAccess = function (accessList) {
        context.fileAccessList = accessList;
        context.isFileButtonEnabled = predictionPanelContainsChanges() || context.predictionData && context.predictionData.anyFiledLocations();
        logService.debug('itemCtrl -> submitAccess -> save', context.fileAccessList);
    };

    /**
    * The save subject event handler.
    * @public
    * @param {string} subject                                           The subject needed to save.
    */
    context.submitRename = function (subject) {
        context.customSubject.currentValue = subject;
        context.isFileButtonEnabled = predictionPanelContainsChanges() || context.predictionData && context.predictionData.anyFiledLocations();
        logService.debug('itemCtrl -> submitRename -> save', context.customSubject.currentValue);
    };

    /**
    * The location checked changed event handler.
    * @public
    * @param {object} filingLocation                                    The active filing location.
    */
    context.checkedChanged = function (filingLocation) {
        // Toggle selection.
        filingLocation.isSelected = !filingLocation.isSelected;

        var shouldAllowToUncheckLastLocation = !context.predictionData.anyFiledLocations() || context.predictionData.anySelectedLocations();

        if (!shouldAllowToUncheckLastLocation) {
            filingLocation.isSelected = true;
            notificationService.showWarningNotification(Constants.PREDICTION_NOTIFICATION_LAST_LOCATION);
        }

        context.isFileButtonEnabled = predictionPanelContainsChanges();
    };

    /**
    * Logs user out and redirect to host selection screen.
    * @public
    */
    context.logOut = function () {
        authService.logOutAsync();
        officeService.removeItemChangedHandlerAsync();
        cabinetService.clearCache();
        navigationService.goToHostSelection();
    };

    /**
    * The file button click handler.
    * @public
    */
    context.fileData = function () {
        context.isFileButtonEnabled = false;

        var filingData = new FilingData(context.predictionData,
                                        context.customSubject.filingValue,
                                        outlookItem.internetMessageId,
                                        outlookItem.exchangeItemId,
                                        context.fileAccessList);

        filingService.fileDataAsync(filingData)
                     .then(onFilingRequestStatusReceived);
    };

    /**
    * Loads data according to conditions.
    * @public
    */
    context.loadDataAsync = function () {
        logService.debug('itemCtrl -> loadDataAsync');
        resetUiData();

        if (!context.cabinetData || !context.cabinetData.hasCabinets) {
            startLoadingChain();
        } else {
            refreshPredictions(context.cabinetData.currentCabinetId);
        }
    };

    /**
    * Starts full loading chain.
    * @private
    */
    function startLoadingChain() {
        logService.debug('itemCtrl -> startLoadingChain');

        cabinetService.loadCabinetsAsync()
                      .then(setCabinetDataOnUi)
                      .then(loadPredictionsAsync)
                      .then(setPredictionDataOnUi)
                      .catch(handleChainErrors);
    }

    /**
    * Displays loaded search locations.
    * @private
    * @param {Scripts.App.Common.Data.models.RequestResult} searchResult       The search request result value.
    */
    function setQuickSearchDataOnUi(searchResult) {
        var isSuccessful = searchResult.isSuccessful && searchResult.response.filingLocations.length > 0;
        context.isSearchInProgress = false;
        context.isCabinetDropdownEnabled = true;

        if (!isSuccessful)
            throw new ChainError(ChainErrorType.quickSearch, searchResult);

        context.quickSearchData = new QuickSearchData(searchResult);
    }

    /**
    * Refreshes the prediction for cabinet.
    * @private
    * @param {string} cabinetId                                                 The cabinet identifier.
    */
    function refreshPredictions(cabinetId) {
        clearPredictionData();

        loadPredictionsAsync(cabinetId)
            .then(setPredictionDataOnUi)
            .catch(handleChainErrors);
    }

    /**
    * Handle chain errors and show message on UI.
    * @private
    * @param {Error} error      The received error value.
    */
    function handleChainErrors(error) {
        if (error instanceof ChainError) {
            if (error.requestResult.requestResultStatus === RequestResultStatus.authenticationFailed) {
                officeService.removeItemChangedHandlerAsync();
                cabinetService.clearCache();
                navigationService.goToLogin();
            } else {
                switch (error.chainErrorType) {
                    case ChainErrorType.cabinet:
                    case ChainErrorType.predictiveSearch:
                        displayMessageOnPanel(errorHelper.getPanelMessage(error.requestResult.statusCode));
                        break;
                    case ChainErrorType.quickSearch:
                        displayMessageOnSearch(errorHelper.getSearchMessage(error.requestResult.statusCode));
                        break;
                }
            }
        } else {
            logService.error('itemCtrl -> handleChainErrors', error);
        }
    }

    /**
    * Displays message of specified type on panel.
    * @private
    * @param {object} message                                                     The message object.
    */
    function displayMessageOnPanel(message) {
        if (message) {
            context.message = message.text;
            context.messageType = MessageType.error;
        }
    }

    /**
    * Displays message of specified type on search popup.
    * @private
    * @param {object} message                                                      The message object.
    */
    function displayMessageOnSearch(message) {
        if (message && !context.isSearchInProgress && context.isSearchActive) {
            context.searchMessage = message.text;
            context.searchMessageType = message.type;
        }
    }

    /**
    * Clears UI items values.
    * @private
    */
    function resetUiData() {
        context.fileAccessList = null;
        context.isApplicationDataLoaded = false;
        context.isRefreshEnabled = false;
        context.isFileButtonEnabled = false;
        context.isCabinetDropdownEnabled = false;
    }

    /**
    * Enables or disables controls in cabinet section.
    * @private
    * @param {boolean} cabientsEnabled                                                      If need to enable/disable cabinets control.
    * @param {boolean} refreshEnabled                                                       If need to enable/disable refresh control.
    * @param {boolean} searchEnabled                                                        If need to enable/disable search control.
    */
    function enableCabinetSection(cabientsEnabled, refreshEnabled, searchEnabled) {
        context.isCabinetDropdownEnabled = cabientsEnabled;
        context.isRefreshEnabled = refreshEnabled;
        context.isSearchEnabled = searchEnabled;
    }

    /**
    * Determines whether prediction panel contains any changes.
    * @private
    * @return {boolean}                                                             True if panel contains changes, otherwise - false.
    */
    function predictionPanelContainsChanges() {
        return context.predictionData && context.predictionData.anyChanges();
    }

    /**
    * Handles filing request result status.
    * @private
    * @param {Scripts.App.Common.Data.enums.FilingStatus} filingRequestStatus         The filing request status.
    */
    function onFilingRequestStatusReceived(filingRequestStatus) {
        if (filingRequestStatus === FilingStatus.cancelled)
            return;

        context.isFileButtonEnabled = filingRequestStatus === FilingStatus.failed && predictionPanelContainsChanges();

        notificationService.showFilingNotification(filingRequestStatus);

        if (filingRequestStatus !== FilingStatus.failed) {
            filingService.setFilingIndicator(outlookItem, true, context.cabinetData);
            filingService.saveTrackingData(outlookItem);
        }
    }

    /**
    * Handles filing tracking result status.
    * @private
    */
    function onFilingTrackingStatusReceived() {
        notificationService.showFilingNotification(FilingStatus.active);
    }

    /**
    * Handles filing task result status.
    * @private
    * @param {object} task                                        The filing task.
    */
    function onFilingTaskStatusReceived(task) {
        var isSuccess = task.response.status === FilingStatus.succeeded;

        if (isSuccess && context.predictionData) {
            context.predictionData.applyFilingResult(task.response.fileItemResults);
        }

        context.isFileButtonEnabled = predictionPanelContainsChanges();

        if (task.type === FilingTaskType.tracking) {
            notificationService.hideNotifications();
        }
        else {
            notificationService.showFinalFilingNotification(isSuccess);
        }

        filingService.saveTrackingData(outlookItem);

        if (!isSuccess) {
            filingService.setFilingIndicator(outlookItem, false, context.cabinetData);
        }
    }

    /**
    * The item changed event handler.
    * @private
    * @param {object} eventArgs                                                         The event arguments.
    */
    function onItemChanged(eventArgs) {
        notificationService.hideNotifications();
        cancelPendingRequests();
        resetUIForItemChanged();

        if (itemChangedCancellationTokenSource) {
            itemChangedCancellationTokenSource.cancel();
        }

        itemChangedCancellationTokenSource = new CancellationTokenSource();

        if (eventArgs.initialData && officeService.isSupportedItem(eventArgs.initialData.itemClass)) {
            outlookItem = new OutlookItem(officeService.activeItem);
            context.customSubject = new OutlookItemSubject(outlookItem);
            context.validatedSubjectValue = context.customSubject.filingValue;

            timeService.cancelAfter(outlookItem.initializeAsync, Constants.OUTLOOK_ITEM_INITIALIZATION_TIMEOUT, itemChangedCancellationTokenSource)
                       .then(() => {
                                    filingService.startTrackingStatus(outlookItem);
                                    context.loadDataAsync();
                                  }, () => logService.debug('itemCtrl -> onItemChanged -> timeService.cancelAfter -> rejected'));
        } else {
            resetUIForItemChangedError();
            displayMessageOnPanel({ text: Constants.UNDEFINED_OUTLOOK_ITEM });
            logService.error('itemCtrl -> onItemChanged', Constants.UNDEFINED_OUTLOOK_ITEM);
        }
    }

    /**
    * Cancels all pending requests.
    * @private
    */
    function cancelPendingRequests() {
        predictionService.cancelPendingRequests();
        searchService.cancelPendingRequests();
        filingService.cancelPendingRequests();
    }

    /**
    * Resets UI and to default on item changed.
    * @private
    */
    function resetUIForItemChanged() {
        context.isSettingsMenuOpen = false;
        context.isAccessDialogOpen = false;
        context.isAboutDialogOpen = false;
        context.isRenameSubjectDialogOpen = false;
        context.searchQueryText = null;
        clearSearchData();
        closeSearchContainer();
        clearPredictionData();
    }

    /**
    * Resets UI and to default on item changed error.
    * @private
    */
    function resetUIForItemChangedError() {
        context.customSubject.reset();
        context.validatedSubjectValue = null;
        context.isApplicationDataLoaded = false;
        enableCabinetSection(false, false, false);
    }

    /**
    * Clears search response data to default.
    * @private
    */
    function clearSearchData() {
        context.quickSearchData = null;
        context.searchMessage = null;
    }

    /**
    * Closes search container.
    * @private
    */
    function closeSearchContainer() {
        context.isSearchActive = false;
        context.isSearchInProgress = false;
        context.isSearchOpen = false;
    }

    /**
    * Clears prediction response data to default.
    * @private
    */
    function clearPredictionData() {
        context.predictionData = null;
        context.message = null;
    }

    /**
    * Runs initialization function when screen loads.
    */
    context.initializeData();
}]);