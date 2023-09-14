const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const router = require('./router.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});