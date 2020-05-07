'use strict';

/**
* @public
* @type {Object<number>} The HTTP status codes enumeration.
*/
var HttpStatusCode = {
    ok: 200,
    multipleChoices: 300,
    redirect: 302,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    tooManyRequests: 429,
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    httpVersionNotSupported: 505
};

/**
* @public
* @type {Object<string>} The message types enumeration.
*/
var MessageType = {
    info: 'message-info',
    error: 'message-error',
    success: 'message-success'
};

/**
* @public
* @type {Object<string>} The notification types enumeration.
*/
var NotificationType = {
    info: 'notification-info',
    error: 'notification-error',
    success: 'notification-success',
    warning: 'notification-warning'
};

/**
* @public
* @type {Object<string>} The location types enumeration.
*/
var LocationType = {
    folder: 'FOLDER',
    filter: 'FILTER',
    workspace: 'WORKSPACE'
};

/**
* @public
* @type {Object<string>} The file access types enumeration.
*/
var FileAccess = {
    me: 'ME',
    default: 'DEFAULT',
    participants: 'PARTICIPANT'
};

/**
* @public
* @type {Object<string>} The HTTP request types enumeration.
*/
var HttpRequestType = {
    get: 'GET',
    post: 'POST'
};

/**
* @public
* @type {Object<number>} The request result custom status enumeration.
*/
var RequestResultStatus = {
    success: 0,
    error: 1,
    authenticationFailed: 2
};

/**
* @public
* @type {Object<number>} The chain error type enumeration.
*/
var ChainErrorType = {
    cabinet: 0,
    predictiveSearch: 1,
    quickSearch: 2
};

/**
* @public
* @type {Object<string>} The filing status enumeration.
*/
var FilingStatus = {
    succeeded: 'SUCCEEDED',
    active: 'ACTIVE',
    failed: 'FAILED',
    cancelled: 'CANCELLED'
};

/**
* @public
* @type {Object<number>} The filing task type enumeration.
*/
var FilingTaskType = {
    regular: 0,
    tracking: 1
};

/**
* @public
* @type {Object<string>} The filing server operation enumeration.
*/
var FilingServerOperation = {
    upload: 'UPLOAD',
    copy: 'COPY',
    profile: 'PROFILE',
    file_nia: 'FILE_NIA',
    file_ia: 'FILE_IA',
    unfile: 'UNFILE',
    unprofile: 'UNPROFILE'
};

/**
* @public
* @type {Object<string>} The loging level enumeration.
*/
var LogLevel = {
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error'
};

/**
* @public
* @type {Object<number>} The hashing method enumeration.
*/
var HashMethod = {
    sha256: 0,
    md5: 1,
    sha512: 2
};

/**
* @public
* @type {Object<number>} The storage type enumeration.
*/
var StorageType = {
    local: 'local',
    mailbox: 'mailbox',
    database: 'database'
};

/**
* @public
* @type {Object<string>} The office host type enumeration.
*/
var OfficeHost = {
    ios: 'OutlookIOS',
    webApp: 'OutlookWebApp',
    desktop: 'Outlook',
    android: 'OutlookAndroid' // custom added, not habe API from office.js
};

/**
* @public
* @type {Object<string>} The office platform enumeration.
*/
var OfficePlatform = {
    ios: 'iOS', // The platform an iOS device.
    officeOnline: 'OfficeOnline',// The platform is Office Online.
    pc: 'PC', // The platform is PC (Windows).
    mac: 'Mac', // The platform is Mac.
    android: 'Android', // The platform is an Android device.
    universal: 'Universal' // The platform is WinRT.
};

/**
* @public
* @type {Object<number>} The dialog result status enumeration.
*/
var DialogResultStatus = {
    resultRecieved: 0,
    cancelled: 1,
    error: 2,
    openError: 3
};

/**
* @public
* @type {Object<number>} The promise status enumeration.
*/
var PromiseStatus = {
    resolved: 0,
    rejected: 1
};

/**
* @public
* @type {Object<string>} The xhr response status enumeration.
*/
var XhrStatus = {
    complete: 'complete',
    error: 'error',
    timeout: 'timeout',
    abort: 'abort'
};

// Freezing object to prevent modifying.
Object.freeze(HttpStatusCode);
Object.freeze(MessageType);
Object.freeze(NotificationType);
Object.freeze(LocationType);
Object.freeze(FileAccess);
Object.freeze(HttpRequestType);
Object.freeze(RequestResultStatus);
Object.freeze(ChainErrorType);
Object.freeze(FilingStatus);
Object.freeze(FilingTaskType);
Object.freeze(FilingServerOperation);
Object.freeze(LogLevel);
Object.freeze(HashMethod);
Object.freeze(StorageType);
Object.freeze(OfficeHost);
Object.freeze(OfficePlatform);
Object.freeze(DialogResultStatus);
Object.freeze(PromiseStatus);
Object.freeze(XhrStatus);