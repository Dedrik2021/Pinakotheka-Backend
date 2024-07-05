import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import createHttpError from 'http-errors'

import routes from '../routes/index.js'

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(cookieParser())
app.use(compression())
app.use(fileUpload({ useTempFiles: true }))
app.use(cors())

app.use('/api/v1', routes)

app.use((req, res, next) => {
    next(createHttpError.NotFound("This route does not exists"))
})

export default app