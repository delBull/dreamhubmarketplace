const express = require('express');
const router = express();
const pandoras_Subscribe = require('./pandoras-subscriber');
const pandoras_Unsubscribe = require('./pandoras-unsubscriber');
const getPandorasEmails = require('./pandoras-all-emails');


router.post('/email', pandoras_Subscribe);
router.delete('/un-subscribe', pandoras_Unsubscribe);
router.get('/pandorasEmails', getPandorasEmails);

module.exports = router