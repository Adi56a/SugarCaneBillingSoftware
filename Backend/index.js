const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const bodyParser  = require('body-parser')
const adminRoutes  = require('./routes/adminRoute')



dotenv.config();

const app  = express();
app.use(bodyParser.json())

app.use(cors())
app.use(express.json())

 connectDB()



app.use('/api/admin', adminRoutes)


app.get('/',(req,res) => {
    res.send("server is running ")
})


const port  = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`server Running on port ${port}`)
})