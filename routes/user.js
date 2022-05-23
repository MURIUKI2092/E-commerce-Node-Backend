const user = require('../models/user');
const { verifyToken,verifyTokenAndAuthorization
  , verifyTokenAndAdmin } = require('./tokenVerification');

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
      const {password ,...others}=person._doc
      res.status(200).json(person)
  }catch (err){
    res.status(500).json(err)

  }
});
 // get all users
 router.get("/",verifyTokenAndAdmin,async(req,res)=>{
   const  query = req.query.new
   try{
     const users=query ? await user.find().sort({_id:-1}).limit(5): 
     await user.find();
     res.status(200).json(users);
   }catch(err){
     res.status(500).json(err)
   };
 });

 // get user stats in one year

 router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
   // todays date
   const date= new Date();
   // one year ago's date

   const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

   try{
     //fetches users data in full
     const data = await user.aggregate([
       {$match:{createdAt:{$gte:lastYear}}},
       {
         // take month number
         $project :{
           month:{$month:"$createdAt"}
         },
       },
       {
         $group:{
           _id:"$month",
           total:{$sum:1}

         }
       }
     ]);
     res.status(200).json(data)

   }catch(err){
     res.status(500).json(err);
   }
 })


module.exports=router