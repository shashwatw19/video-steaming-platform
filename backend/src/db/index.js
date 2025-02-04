import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import { DB_NAME } from '../contants.js'

const dbConnect = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI+`${DB_NAME}`)
        console.log(`Connected to ${connectionInstance.connection.name} database`)
    } catch (error) {
        console.log('error while connecting to Database ',error)
    }
}
export {dbConnect}