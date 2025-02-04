import {app} from './app.js'
import { dbConnect } from './db/index.js'


dbConnect()

.then(()=>{
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Error while connecting to database ',err)
})
