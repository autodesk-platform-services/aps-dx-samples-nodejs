const { SdkManagerBuilder } = require('@aps_sdk/autodesk-sdkmanager');
const { AuthenticationClient, ResponseType, Scopes } = require('@aps_sdk/authentication');
const { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_CALLBACK_URL } = require('../../config.js');

const sdkManager = SdkManagerBuilder.create().build();
const authenticationClient = new AuthenticationClient(sdkManager);

function getAuthorizationUrl() {
    return authenticationClient.authorize(APS_CLIENT_ID, ResponseType.Code, APS_CALLBACK_URL, [Scopes.DataRead, Scopes.ViewablesRead]);
}

async function authCallbackMiddleware(req, res, next) {
    const internalCredentials = await authenticationClient.getThreeLeggedToken(APS_CLIENT_ID, req.query.code, APS_CALLBACK_URL, {
        clientSecret: APS_CLIENT_SECRET
    });
    const publicCredentials = await authenticationClient.getRefreshToken(APS_CLIENT_ID, internalCredentials.refresh_token, {
        clientSecret: APS_CLIENT_SECRET,
        scopes: [Scopes.ViewablesRead]
    });
    req.session.public_token = publicCredentials.access_token;
    req.session.internal_token = internalCredentials.access_token;
    req.session.refresh_token = publicCredentials.refresh_token;
    req.session.expires_at = Date.now() + internalCredentials.expires_in * 1000;
    next();
}

async function authRefreshMiddleware(req, res, next) {
    const { refresh_token, expires_at } = req.session;
    if (!refresh_token) {
        res.status(401).end();
        return;
    }

    if (expires_at < Date.now()) {
        const internalCredentials = await authenticationClient.getRefreshToken(APS_CLIENT_ID, refresh_token, {
            clientSecret: APS_CLIENT_SECRET,
            scopes: [Scopes.DataRead, Scopes.ViewablesRead]
        });
        const publicCredentials = await authenticationClient.getRefreshToken(APS_CLIENT_ID, internalCredentials.refresh_token, {
            clientSecret: APS_CLIENT_SECRET,
            scopes: [Scopes.ViewablesRead]
        });
        req.session.public_token = publicCredentials.access_token;
        req.session.internal_token = internalCredentials.access_token;
        req.session.refresh_token = publicCredentials.refresh_token;
        req.session.expires_at = Date.now() + internalCredentials.expires_in * 1000;
    }
    req.internalOAuthToken = {
        access_token: req.session.internal_token,
        expires_in: Math.round((req.session.expires_at - Date.now()) / 1000),
    };
    req.publicOAuthToken = {
        access_token: req.session.public_token,
        expires_in: Math.round((req.session.expires_at - Date.now()) / 1000),
    };
    next();
}

async function getUserProfile(credentials) {
    const resp = await authenticationClient.getUserInfo(credentials.access_token);
    return resp;
}

module.exports = {
    getAuthorizationUrl,
    authCallbackMiddleware,
    authRefreshMiddleware,
    getUserProfile
};
