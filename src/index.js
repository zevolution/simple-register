require('dotenv/config');

const express = require('express');
const cors = require('cors');
const apiHandlingErrorMiddleware = require('./app/middlewares/apiHandlingError');

const app = express();
app.use(cors());
app.use(express.json());
app.use(require('./routes.js'));
app.use(apiHandlingErrorMiddleware);

app.listen(3333);