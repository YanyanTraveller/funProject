const express = require('express');
const appController = require('../controllers/llmController.js');
const fs = require("fs");
const path = require("path");
const router = express.Router();


router.get('/refreshToken', appController.getToken);

router.get('/api/llm-test', appController.test);
router.get('/api/search/:query', appController.getSearchResult);

router.get('/page/search', appController.getSearchPage)

module.exports = router;