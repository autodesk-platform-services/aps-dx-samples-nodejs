const express = require('express');
const {authRefreshMiddleware} = require('../services/aps/auth.js');
const {getHubs, getProjects,
    getFolders, getFolderContent,
    getExchangeInfo,
    getDataByCategory,
    getVolumeDataByCategory
    } = require('../services/aps/dx.js');

let router = express.Router();

router.use(authRefreshMiddleware);



// Navigation to the exchange file
router.get('/hubs', async function (req, res, next) {
    try {
        const hubs = await getHubs(req.internalOAuthToken);
        res.json(hubs);
    } catch (err) {
        next(err);
    }
});

router.get('/hubs/:hub_id/projects', async function (req, res, next) {
    try {
        const contents = await getProjects(req.params.hub_id, req.internalOAuthToken);
        res.json(contents);
    } catch (err) {
        next(err);
    }
});

router.get('/hubs/:hub_id/projects/:project_id/folders', async function (req, res, next) {
    try {
        const properties = await getFolders(req.params.hub_id, req.params.project_id, req.internalOAuthToken);
        res.json(properties);
    } catch (err) {
        next(err);
    }
});

router.get('/hubs/:hub_id/projects/:project_id/folders/:folder_id', async function (req, res, next) {
    try {
        const properties = await getFolderContent(req.params.hub_id, req.params.project_id, req.params.folder_id, req.internalOAuthToken);
        res.json(properties);
    } catch (err) {
        next(err);
    }
});


router.get('/exchange/:exchange_file_urn', async function (req, res, next) {
    try {
        const properties = await getExchangeInfo(req.params.exchange_file_urn, req.internalOAuthToken);
        res.json(properties);
    } catch (err) {
        next(err);
    }
});

router.get('/exchange/:exchange_id/takeoff/:category', async function (req, res, next) {
    try {
        const properties = await getDataByCategory(req.params.exchange_id, req.params.category, req.internalOAuthToken);
        res.json(properties);
    } catch (err) {
        next(err);
    }
});

router.get('/exchange/:exchange_id/takeoff/:category/volumes', async function (req, res, next) {
    try {
        const properties = await getVolumeDataByCategory(req.params.exchange_id, req.params.category, req.internalOAuthToken);
        res.json(properties);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
