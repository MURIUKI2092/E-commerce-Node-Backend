const express = require('express');
const app = express();
port= 5000;
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const userRoute = require('./routes/user')
const authRoute =require('./routes/auth')
const productsRoute =require('./routes/product')

mongoose.
connect(
  process.env.MONGO_URL
  )
  .then(()=>console.log("DB Connection successful!!"))
  .catch ((err)=>{
    console.log("err");
  })
app.use(express.json())
app.use("/api/users",userRoute);
app.use('/api/auth',authRoute);
app.use('/api/products',productsRoute)

app.listen(process.env.PORT ||{port},()=>{
  console.log('backend is running')
})