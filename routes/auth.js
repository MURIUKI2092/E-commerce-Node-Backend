const router = require('express').Router();
const User= require('../models/user')
const CryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

//REGISTER function
router.post ('/register',async(req,res)=>{

  if (!req.username || !req.email ||!req.password){
    return res.status(500).json({
      message:"make sure you fill all the fields required"
    })
  }
  else if(req.password.length<6){
    return res.status(400).json({
      message:"password length is shorter than required"
    })
  }
 
  const newUser = new User ({
    username: req.body.username,
    email: req.body.email,
    password:CryptoJs.AES.encrypt(req.body.password
      ,process.env.secret_pass).toString() ,
   
  });
  try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser)
    
  }catch(err){
    res.status(500).json({
      message:"register error"
    })
  }


});

//LOGIN function

router.post("/login",async(req,res)=>{
  try{
    const user = await User.findOne({username:req.body.username})
    if (!user){
      res.status(401).json("Wrong credentials")
    }
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
       process.secret_pass);
    const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8)
    
    if (OriginalPassword !== req.body.password){
      res.status(401).json("Wrong credentials")

    }
    const accessToken =jwt.sign({
      id:user._id,
      isAdmin:user.isAdmin

    },process.env.jwt_key)

    const {password ,...others}= user._doc;
    res.status(200).json({...others,accessToken} )
  }catch(err){
    res.status(500).json(err)
  }

})



module.exports=router