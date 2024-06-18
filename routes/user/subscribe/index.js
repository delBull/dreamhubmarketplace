const express = require('express');
const router = express();
const email_Subscribe = require('./email-subscribe');
const email_Unsubscribe = require('./email-unsubscribe');
const getEmails = require('./get-emails');


router.post('/email', email_Subscribe);
router.delete('/un-subscribe', email_Unsubscribe);
router.get('/getEmails', getEmails);

module.exports = router