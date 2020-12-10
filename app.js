const express=require('express');
const app=express()
const mongoose=require('mongoose')
const {MONGOURI} =require('./keys')
const PORT=5000
const authRoute=require('./routes/auth')
const postRoute=require('./routes/post')
const userRoute=require('./routes/user')
var cors = require('cors')


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("We got a connection !! Baby")
})
mongoose.connection.on('error',(err)=>{
    console.log("We got a error",err)
})
app.use(cors())
app.use(express.json())
app.use(authRoute)
app.use(postRoute)
app.use(userRoute)
app.listen(PORT)