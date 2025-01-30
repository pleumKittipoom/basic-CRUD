const express = require('express')
const app = express()
const router = require('./Router/myRouter')
const path = require('path')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:false}))
app.use(router)




app.listen(8001, ()=>{
    console.log('Server is running on port 8001')
    })