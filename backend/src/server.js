const express = require("express")
const routes = require('./routes')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
//const scheduler = require('~/untils/scheduler')
//const dotenv = require('dotenv')
//dotenv.config()
//import mongoose from 'mongoose'

import { CONNECT_DB } from './config/mongodb'
import { env } from '~/config/environment'

const START_SERVER = () => {
  const app = express()
  //app.use(cors())
  app.use(cors({ credentials: true, origin: 'http://localhost:5173' })); //origin:true
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(express.json())

  routes(app)

  const port = env.APP_PORT || 8017

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  require('./utils/scheduler');

  if (process.env.BUILD_MODE === "dev") {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`)
    })
  } else {
    app.listen(process.env.PORT, () => {
      console.log(`Hello ${env.AUTHOR}, I am running at ${process.env.PORT}`)
    })

  }
}

CONNECT_DB()
  .then(() => {
    console.log("Connected to MongoDB Atlas!")
  })
  .then(() => { START_SERVER() })
  .catch(error => {
    console.error(error)
    process.exit(0)
  })

