const express = require('express');
const router = express.Router();

const winnerController = require('./controllers/winnerController.js');

router.get('/determineWinner', winnerController.determineWinner);

module.exports = router;
