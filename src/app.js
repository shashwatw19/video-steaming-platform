import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// import routes
import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
app.get('/', (req, res) => {res.send('Hello Mf!!')})

// declare routes
app.use("/api/v1/users", userRouter)
app.use('/api/v1/tweet' , tweetRouter )

export {app} 

