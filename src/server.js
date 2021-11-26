const express=require('express')

const app=express();
const errorHandler =require('./middleware/500')
const notFoundError=require('./middleware/404')
require('dotenv').config();

const PORT=process.env.PORT ||3030

app.get('/',(req,res)=>{
    res.status(200).send('اهلا وسهلا ')
})

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