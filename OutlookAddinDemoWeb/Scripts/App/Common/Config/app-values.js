'use strict';

/**
* Application global values.
*/
app.value('hostList', [
    {
        Id: 'prod.name.com',
        Name: 'prod (USA)',
        ApiUrl: 'product-us.domain.com'
    },
    {
        Id: 'eu.domain.com',
        Name: 'EU (EU/UK)',
        ApiUrl: 'product-eu.domain.com'
    },
    {
        Id: 'au.domain.com',
        Name: 'AU (Australia)',
        ApiUrl: 'product-au.domain.com'
    },
    {
        Id: 'lab.domain.com',
        Name: 'lab (USA)',
        ApiUrl: 'product-lab.domain.com'
    }
]);

/**
* The error list for prediction panel.
*/
app.value('panelErrorList', [
    { Id: HttpStatusCode.internalServerError, Text: 'The server could not display your filing locations' },
    { Id: HttpStatusCode.badGateway, Text: 'There is no internet connection available' },
    { Id: HttpStatusCode.notFound, Text: 'The server could not display your filing locations' },
    { Id: HttpStatusCode.tooManyRequests, Text: 'The server could not display your filing locations' },
    { Id: HttpStatusCode.ok, Text: 'The server could not display your filing locations' }
]);

/**
* The error list for quick search.
*/
app.value('searchErrorList', [
    { Id: HttpStatusCode.internalServerError, Text: 'The server is not accessible' },
    { Id: HttpStatusCode.notImplemented, Text: 'The server is not accessible' },
    { Id: HttpStatusCode.badGateway, Text: 'The server is not accessible' },
    { Id: HttpStatusCode.serviceUnavailable, Text: 'The server is not accessible' },
    { Id: HttpStatusCode.gatewayTimeout, Text: 'The server is not accessible' },
    { Id: HttpStatusCode.httpVersionNotSupported, Text: 'The server is not accessible' },
    { Id: HttpStatusCode.ok, Text: 'No search results found' }
]);

/**
* The file access list.
*/
app.value('fileAccessList', [
    { Id: FileAccess.default, Name: 'Default', Selected: true },
    { Id: FileAccess.me, Name: 'Me', Selected: false },
    { Id: FileAccess.participants, Name: 'Participants', Selected: false }
]);

/**
* The default value of user identifier, will be set on addin initialization.
*/
app.value('outlookUserId', null);