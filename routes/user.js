const user = require('../models/user');
const { verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./tokenVerification');

const router = require('express').Router();
// the added user  details are stored in the database
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
  if (req.body.password){
    //password is hashed
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.secret_pass
    ).toString()
  }
  try{
    const updatedUser =await user.findByIdAndUpdate(
      req.params.id,{
      $set:req.body
    },
    {new:true}
    );
    res.status(200).json(updatedUser)
  }catch(err){
    res.status(500).json(err);
  }

});
// delete a user 
router.delete("/delete/:id",verifyTokenAndAuthorization,async(req,res)=>{
  try{
    await  user.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted")
  }catch(err){
    res.status(500).json(err)
  }
});
//get a user using an id param
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
  try{
    const person =await user.findById(req.params
      .id)
      //destructuring the user details and removing the password
      // and return it in a doc form displaying other details beside password.
      const {password ,...others}=user._doc
      res.status(200).json(person)
  }catch (err){
    res.status(500).json(err)

  }
});
 // get all users
 router.get("/",verifyTokenAndAdmin,async(req,res)=>{
   try{
     const users= await user.find();
     res.status(200).json(users);
   }catch(err){
     res.status(500).json(err)
   };
 });


module.exports=router