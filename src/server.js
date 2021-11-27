const express=require('express')

const app=express();
const router = require('./routes/auth')
const errorHandler =require('./middleware/500')
const notFoundError=require('./middleware/404')
require('dotenv').config();
const cors = require('cors')
const PORT=process.env.PORT ||3030

// app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
    res.status(200).send('اهلا وسهلا ')
})

app.use(router)
app.use('*',notFoundError)
app.use(errorHandler)

function start(){

    app.listen(PORT,()=>{
console.log(`server is standing on ${PORT}`)
    })
}

module.exports={
    start:start
}