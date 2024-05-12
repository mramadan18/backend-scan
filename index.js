import express from 'express'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve('config/config.env')})
import initApp from './src/utils/initiateApp.js'

const app = express()
initApp(app, express)