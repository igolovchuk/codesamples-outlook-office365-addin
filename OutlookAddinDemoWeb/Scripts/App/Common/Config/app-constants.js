'use strict';

/**
* Application constants.
*/
var Constants = {
     // Region URL's.
    'APP_SETTINGS_URL': '../appSettings.json',
    'REDIRECT_URL': '/Pages/Index.html',
    'HTTPS_SCHEME': 'https://',
    'API_PREFIX': 'api.',
    'API_VERSION_ONE_URL_PATH': '/v1',
    'OUTLOOK_API_VERSION_TWO': 'v2.0',
    'LOGGING_URL': 'clientLogging',
    'TOKEN_URL_TEMPLATE': '{0}{1}{2}/v1/OAuth',
    'TOKEN_REQUEST_BODY_TEMPLATE': 'grant_type=authorization_code&code={0}&redirect_uri={1}',
    'TOKEN_PKCE_REQUEST_BODY_TEMPLATE': 'grant_type=authorization_code&code={0}&code_verifier={1}&redirect_uri={2}',
    'REST_API_MESSAGE_PROPERTIES_TEMPLATE': '{0}/{1}/me/messages/{2}?$select={3}',
    'CLAIMS_TICKET_TEMPLATE' : '{0}{1}{2}',
    'BASIC_AUTH_HEADER_NAME': 'Basic ',
    'BEARER_AUTH_HEADER_NAME': 'Bearer ',
    'CONTENT_TYPE_HEADER_NAME': 'Content-Type',
    'CONTENT_TYPE_URL_ENCODED': 'application/x-www-form-urlencoded; charset=UTF-8',
    'CONTENT_TYPE_JSON': 'application/json; charset=UTF-8',
    'CODE_PARAMETER': 'code',
    'HOST_PARAMETER': 'sc',
    'GRANT_TYPE_REFRESH_TOKEN': 'refresh_token',
    'QUESTION_CHARACTER': '?',
    'STATUS_CODE_START_4X': '4',
    'STATUS_CODE_START_5X': '5',
    'EXCEPTION_HANDLER_CAUSE_TEMPLATE': ' (caused by {0})',
    // End region URL's.
     // Region types URL's.
     'TYPE_FUNCTION': 'function',
     'TYPE_STRING': 'string',
     // End region types.
     'NO_ID' : '-1',
     'NO_SUBJECT': 'No name',
     'NO_VALUE': 'No value',
     'FILING_DATE_FORMAT': 'mm_dd_yyyy hh_MM TT',
     'LOCATION_PARENT_NAME_TEMPLATE': ' (.../ {0})',
     'THREE_DOTS' : '...',
     'EMPTY_STRING': '',
     'COLON_STRING': ':',
     'FORWARD_SLASH_STRING': '/',
     'COMMA_STRING': ',',
     'ATSIGN_STRING': '@',
     'SEMI_COLON_SPACE_STRING': ' ; ',
     'SPACE_STRING': ' ',
     'VERTICAL_LINE_SEPARATOR': '|',
     'BODY_MAX_LENGTH': 200,
     'SUBJECT_MAX_LENGTH': 1000,
     'CODE_VERIFIER_LENGTH': 20,
     'STATE_PARAM_LENGTH': 15,
     'OUTLOOK_ITEM_INITIALIZATION_TIMEOUT': 2200,
     'HOST_SEC_KEY_START_INDEX': 0,
     'HOST_SEC_KEY_END_INDEX': 5,
     'TICKET_ONE_KEY_START_INDEX': 4,
     'TICKET_ONE_KEY_END_INDEX': 8,
     'TICKET_TWO_KEY_START_INDEX': 8,
     'TICKET_TWO_KEY_END_INDEX': 12,
     'RETRY_COUNT': 3,
     'LAST_CHARACTER_REGEX': /.$/,
     'ICON_TYPE_SVG': 'svg',
     'IMAGE_TEMPLATE': '{0}.{1}',
     'STORAGE_KEY_TEMPLATE': '{0}{1}',
     // Region custom error messages.
     'LOGIN_ERROR': 'Login was unsuccessful, try again later.',
     'UNDEFINED_OUTLOOK_ITEM': 'This item type is not supported.',
     'PANEL_DEFAULT_ERROR_MESSAGE': 'There is an issue with getting your filing locations',
     'SEARCH_DEFAULT_ERROR_MESSAGE': 'Error in search occurred',
     'CABINET_LOAD_ERROR_DROPDOWN': 'Not available',
     'NO_ERROR_MESSAGE': 'No error message',
     'APP_SETTINGS_LOAD_ERROR_MESSAGE': 'Could not load applications settings.',
     'APP_LOAD_OUTSIDE_MAILBOX_ERROR_MESSAGE': 'Application is loaded outside of MailBox.',
     'SECURITY_HELPER_RANDOM_STRING_EMPTY_ALPHABET_ERROR': 'Argument \'chars\' is undefined',
     'SECURITY_HELPER_RANDOM_STRING_INVALID_LENGTH_ERROR': 'Argument \'chars\' should not have more than 256 characters, otherwise unpredictability will be broken',
     'HTTP_SERVICE_NOT_SUPPORTED_PROMISE_STATUS_ERROR': 'Not supported promise status',
      // End region error messages.
      // Region service names.
     'AUTH_SERVICE_NAME' : 'authService',
     'HTTP_SERVICE_NAME': 'httpService',
     'LOGGING_SERVICE_NAME': 'logService',
      // End region service names.
      // Region notifications.
     'FILING_NOTIFICATION_IN_PROGRESS': 'Submitted',
     'FILING_NOTIFICATION_IN_PROGRESS_SUB_TEXT': 'Meanwhile, tap <action>Back</action> to work on another email.',
     'NOTIFICATION_DEFAULT_FADEOUT_TIME': 5000, // In milliseconds.
     'NOTIFICATION_ERROR_FADEOUT_TIME': 25000,  // In milliseconds.
     'NOTIFICATION_SUCCESS_FADEOUT_TIME': 5000, // In milliseconds.
     'NOTIFICATION_NO_FADEOUT' : -1,
     'NOTIFICATION_CLOSE_ICON_WHITE' : 'notification-close-white',
     'NOTIFICATION_CLOSE_ICON_BLACK': 'notification-close-black',
      // End region notifications.
      // Region style names
     'STYLE_PANEL_WITH_SEARCH': 'panel-with-search',
     'STYLE_PANEL_WITHOUT_SEARCH': 'panel-without-search',
      // End region style names
      // Region cache keys
     'CABINET_CACHE_KEY': 'cabinet_cache',
      // End region cache keys
      // Region property names
     'CODE_VERIFIER_PROP_NAME': 'codeVerifier',
     'STATE_PARAM_PROP_NAME': 'state',
     'INTERNET_HEADERS_PROPERTY_NAME': 'InternetMessageHeaders',
     'CONVERSATION_INDEX_PROPERTY_NAME': 'ConversationIndex',
      // End region property names
      // Region outlook item types
     'OUTLOOK_ITEM_TYPE_POST': 'IPM.Post',
     'OUTLOOK_ITEM_TYPE_MESSAGE': 'IPM.Note',
      // End region outlook item types
      'VERSION': 'v1.1',
      'APP_ID': 'product-Mobile'
};

// Make it immutable.
Object.freeze(Constants);