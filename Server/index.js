const express = require('express')
const app = express();
require('dotenv').config()

require('./config/mongoose').connect()

const PORT = process.env.PORT || 4000

