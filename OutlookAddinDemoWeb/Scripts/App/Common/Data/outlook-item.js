'use strict';

/**
 * The outlook item wrapper.
 * @constructor
 * @param {Office.context.mailbox.item} item      The outlook office.js item.
 */
function OutlookItem(item) {

    /**
    * @private @type {OutlookItem} The main context.
    */
    var context = this;

    /**
    * @private @type {Office.context.mailbox.item} The outlook working item.
     */
    var itemModel = item;

    /**
    * @property {string} exchangeItemId Gets the outlook item identifier.
    */
    Object.defineProperty(this, 'exchangeItemId', {
        value: getStringValue(itemModel.itemId),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} subject Gets the outlook item subject.
    */
    Object.defineProperty(this, 'subject', {
        value: getStringValue(itemModel.subject),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} subject Gets the outlook item subject.
    */
    Object.defineProperty(this, 'internetMessageId', {
        value: getStringValue(itemModel.internetMessageId),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} conversationId Gets the outlook item conversation identifier.
    */
    Object.defineProperty(this, 'conversationId', {
        value: getStringValue(itemModel.conversationId),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} sentDate Gets the outlook item dateTime created.
    */
    Object.defineProperty(this, 'sentDate', {
        value: itemModel.dateTimeCreated,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} dateTimeModified Gets the outlook item dateTime modified.
    */
    Object.defineProperty(this, 'dateTimeModified', {
        value: itemModel.dateTimeModified,
        writable: false
    });

    /**
    * @property {string} itemClass Gets the outlook item class.
    */
    Object.defineProperty(this, 'itemClass', {
        value: getStringValue(itemModel.itemClass),
        writable: false
    });

    /**
    * @property {string} itemType Gets the outlook item type.
    */
    Object.defineProperty(this, 'itemType', {
        value: getStringValue(itemModel.itemType),
        writable: false
    });

    /**
    * @property {string} toRecipients Gets the outlook item to recipients.
    */
    Object.defineProperty(this, 'toRecipients', {
        value: getEmailAddressesArray(itemModel.to || itemModel.requiredAttendees),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} ccRecipients Gets the outlook item cc recipients.
    */
    Object.defineProperty(this, 'ccRecipients', {
        value: getEmailAddressesArray(itemModel.cc || itemModel.optionalAttendees),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} attachmentFilenames Gets the outlook item attachment file names.
    */
    Object.defineProperty(this, 'attachmentFilenames', {
        value: getAttachmentsArray(itemModel.attachments),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} fromAddress Gets the outlook item from(sender) address.
    */
    Object.defineProperty(this, 'fromAddress', {
        value: itemModel.from && itemModel.from.emailAddress || itemModel.organizer && itemModel.organizer.emailAddress || Constants.EMPTY_STRING,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} fromName Gets the outlook item from(sender) name.
    */
    Object.defineProperty(this, 'fromName', {
        value: itemModel.from && itemModel.from.displayName || itemModel.organizer && itemModel.organizer.displayName || Constants.EMPTY_STRING,
        writable: false
    });

    /**
    * @property {string} messageBody Gets or sets the outlook item body.
    */
    Object.defineProperty(this, 'messageBody', {
        value: null,
        writable: true,
        enumerable: true
    });

    /**
    * @property {Office.CustomProperties} customProperties The outlook working item custom properties data.
    */
    Object.defineProperty(this, 'customProperties', {
        value: null,
        writable: true
    });

    /**
    * @property {Scripts.App.Common.Data.outloo-item.OutlookItemHeaders} internetHeaders The outlook working item internet headers data.
    */
    Object.defineProperty(this, 'internetHeaders', {
        value: null,
        writable: true
    });

    /**
    * @property {Microsoft.OutlookServices.Message.ConversationIndex} conversationIndex The outlook working item conversation index data.
    */
    Object.defineProperty(this, 'conversationIndex', {
        value: null,
        writable: true
    });

    /**
    * @callback or @promise InitCompleted
    */
    /**
    * Initializes all data that requires asynchronous call to exchange.
    * @public 
    * @param {InitCompleted} initCompleted                               The callback function or promise object indicating finishing of initialization.
    */
    OutlookItem.prototype.initializeAsync = function (initCompleted) {
        var waitingTasks = { count: 3 };

        // First task for initialization running in parallel to other.
        itemModel.body.getAsync(Office.CoercionType.Text,
            { asyncContext: context },
            function (asyncResult) {
                if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                    var thisItem = asyncResult.asyncContext;
                    thisItem.messageBody = String.crop(asyncResult.value.trim(), Constants.BODY_MAX_LENGTH);
                }

                tryCompleteInitializationTask(initCompleted, waitingTasks);
            });

        // Second task for initialization running in parallel to other.
        itemModel.loadCustomPropertiesAsync(
            function (asyncResult) {
                var thisItem = asyncResult.asyncContext;
                thisItem.customProperties = asyncResult.value;
                tryCompleteInitializationTask(initCompleted, waitingTasks);
            }, context);

        // Third task for initialization running in parallel to other.
        itemModel.RestApi.getItemPropertiesAsync(context.exchangeItemId, [Constants.INTERNET_HEADERS_PROPERTY_NAME, Constants.CONVERSATION_INDEX_PROPERTY_NAME])
                 .then(function (asyncResult) {
                    if (asyncResult[Constants.INTERNET_HEADERS_PROPERTY_NAME]) {
                         context.internetHeaders = new OutlookItemHeaders(asyncResult[Constants.INTERNET_HEADERS_PROPERTY_NAME]);
                    }

                    context.conversationIndex = asyncResult[Constants.CONVERSATION_INDEX_PROPERTY_NAME];
                    tryCompleteInitializationTask(initCompleted, waitingTasks);
                 });
    };

    /**
    * @callback InitCompleted
    */
    /**
    * Decreases the amount of tasks and tries to call initialization callback function.
    * @private 
    * @param {InitCompleted} initCompleted                 The callback function or promise object indicating finishing of initialization.
    * @param {object} waitingTasks                         The waiting tasks object that needed to check if all tasks are finished.
    */
    function tryCompleteInitializationTask(initCompleted, waitingTasks) {
        if (waitingTasks.count > 0)
            waitingTasks.count--;

        if (waitingTasks.count === 0 && initCompleted) {
            if (initCompleted.promise) {
                initCompleted.resolve();
            }
            else if (typeof initCompleted === Constants.TYPE_FUNCTION) {
                initCompleted();
            }
        }
    }

    /**
    * Gets the recipients names array from item recipients.
    * @private
    * @param {Array<EmailAddressDetails>} addresses       The item recipients.
    * @return {Array<string>}                             The recipient names array from item recipients.
    */
    function getEmailAddressesArray(addresses) {
        var result = [];

        if (addresses && addresses.length > 0) {
            for (var i = 0; i < addresses.length; i++) {
                result.push(addresses[i].emailAddress);
            }
        }

        return result;
    }

    /**
    * Gets the attachment names array from item attachments.
    * @private
    * @param {Array<AttachmentDetails>} attachments       The item attachments.
    * @return {Array<string>}                             The attachment names array from item attachments.
    */
    function getAttachmentsArray(attachments) {
        var result = [];

        if (attachments && attachments.length > 0) {
            for (var i = 0; i < attachments.length; i++) {
                result.push(attachments[i].name);
            }
        }

        return result;
    }

    /**
    * Gets the property value or empty string.
    * @private
    * @param {string} value      The property value.
    * @return {string}           The property value or empty string.
    */
    function getStringValue(value) {
        var result = Constants.EMPTY_STRING;

        if (value) {
            result = value;
        }

        return result;
    }
}


/**
* The outlook item subject wrapper.
* @constructor
* @param {Scripts.App.Common.Data.outlook-item} itemModel                              The ootlook item.
*/
function OutlookItemSubject(itemModel) {
    /**
    * @property {string} originalValue                                                  Gets the outlook item original subject.
    */
    Object.defineProperty(this, 'originalValue', {
        value: itemModel.subject,
        writable: true
    });

    /**
    * @property {string} currentValue                                                   Gets the outlook item current subject or default subject name.
    */
    Object.defineProperty(this, 'currentValue', {
        value: itemModel.subject || Constants.NO_SUBJECT,
        writable: true
    });

    /**
    * @property {string} validationPattern                                              Gets the subject validation pattern.
    */
    Object.defineProperty(this, 'validationPattern', {
        value: /[/\\*?":|<>]/g,
        writable: false
    });

    /**
    * @property {boolean} isDefined                                                     Determines if current subject is defined.
    */
    Object.defineProperty(this, 'isDefined', {
        get: function () {
            return this.currentValue !== Constants.NO_SUBJECT && this.currentValue.replace(this.validationPattern, Constants.EMPTY_STRING).trim() !== Constants.EMPTY_STRING;
        }
    });

    /**
    * @public @property {string} filingValue                                            Gets the subject value for filing.
    */
    Object.defineProperty(this, 'filingValue', {
        get: function () {
            var filingValue = this.currentValue;

            if (!this.isDefined) {
                filingValue = 'Message';

                if (itemModel.fromName) {
                    filingValue += ' from ' + itemModel.fromName;
                }

                if (itemModel.sentDate) {
                    filingValue += ' on ' + itemModel.sentDate.formatDate(Constants.FILING_DATE_FORMAT);
                }
            }

            var validatedValue = filingValue.replace(this.validationPattern, Constants.EMPTY_STRING);

            return String.crop(validatedValue, Constants.SUBJECT_MAX_LENGTH);
        }
    });

    /**
    * Resets subject values.
    * @public
    */
    this.reset = function () {
        this.originalValue = null;
        this.currentValue = null;
    };
}

/**
* The outlook item headers wrapper.
* @constructor
* @param {Array<object>} internetHeaders                                                The ootlook item headers.
*/
function OutlookItemHeaders(internetHeaders) {
    /**
    * @property {string}          threadIndex                                           Gets the outlook item thread index.
    */
    Object.defineProperty(this, 'threadIndex', {
        value: getHeaderValue('Thread-Index'),
        writable: false
    });

    /**
    * @property {Array<string>}   references                                            Gets the outlook item references array.
    */
    Object.defineProperty(this, 'references', {
        value: getHeaderArrayValue('References', Constants.SPACE_STRING),
        writable: false
    });

    /**
    * Resets header value.
    * @public
    * @param   {srting}            headerName                                           The header name.
    * @returns {string}                                                                 The header value or empty string;
    */
    function getHeaderValue(headerName) {
        var item = internetHeaders.find(x => x.Name === headerName);

        return item && item.Value || Constants.EMPTY_STRING; 
    }

    /**
    * Resets header value.
    * @public
    * @param   {srting}            headerName                                           The header name.
    * @param   {srting}            splitCharacter                                       The split character.
    * @returns {string}                                                                 The header value or empty string;
    */
    function getHeaderArrayValue(headerName, splitCharacter) {
        var item = internetHeaders.find(x => x.Name === headerName);

        return item && item.Value && item.Value.split(splitCharacter) || [];
    }
}