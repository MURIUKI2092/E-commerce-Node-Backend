const Cart= require("../models/cart");
const  { verifyToken,verifyTokenAndAuthorization
  , verifyTokenAndAdmin } = require('./tokenVerification');

const router = require('express').Router();
// creating a Cart
// everyone logged in can create a cart
//
router.post("/",verifyToken,async(req,res)=>{
  const newCart= new Cart (req.body);

  try{
    const createdCart = await newCart.save();
    res.status(200).json(createdCart)
  }catch(err){
    res.status(500).json(err);
  }

})
// updating a cart
//user can change their own Cart 
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
  try{
    const updatedCart=await  Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set:req.body,
      },
      {new:true}

    );
    res.status(200).json(updatedCart)

  }catch(err){
    res.status(500).json(err);
  }
});
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
  try{
    await Cart.findByIdAndDelete(req.params.id);
    req.status(200).json("Cart has been deleted");
  }catch(err){
    res.status(500).json(err);
  }
});

//get  user  Cart
// only allowed user can access a cart
//it uses users id as a parameter to obtain the Cart
router.get("/find/:id",verifyTokenAndAuthorization, async(req,res)=>{
  try{
    const userCart = await Cart.findOne( req.params.id);
    res.status(200).json(userCart)

  }catch(err){
    res.status(500).json(err);
  }
});

// get all Carts
// only an admin can do this

router.get("/",verifyTokenAndAdmin,async(res,req)=>{
  try{
    const allCarts= await Cart.find()
    res.status(200).json(allCarts)

  }catch(err){
    res.status(500).json(err)
  }
})



module.exports=router