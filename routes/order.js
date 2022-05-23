const Order = require("../models/order");
const  { verifyToken,verifyTokenAndAuthorization
  , verifyTokenAndAdmin } = require('./tokenVerification');
  const router = require('express').Router();


  // create an Order
  // to make an order one must be logged in the system

  router.post("/",verifyToken,async(req,res)=>{
    const newOrder = new Order(req.body);

    try{
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder)

    }catch(err){
      req.status(500).json(err);
    }
  });
// updating the order table
//  only admin can do this

router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
  try{
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {$set : req.body},
      {new:true}
    );
    res.status(200).json(updatedOrder)

  }catch(err){
    res.status(500).json(err);
  }
})

//deleting our Order
// only Admin can delete the orders in the system

router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
  try{
    await Order.findByIdAndDelete(req.params.id);
    req.status(200).json("The order has been deleted");


  }catch(err){
    res.status(500).json(err)
  }
})

// get single User Order
// only authorized individual can do this
//uses a user Id as the parameter to search  for the order

router.get("/find/:id",verifyTokenAndAuthorization,async(req,res)=>{
  try{
    const orders = await Order .find(req.params.id);
    res.status(200).json(orders)

  }catch(err){
    res.status(500).json(err);
  }

});
// get all orders
// only an admin can do this acton
//
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
  try{
    const allOrders= await Order.find()
    res.status(200).json(allOrders)

  }catch(err){
    res.status(500).json(err)
  }
})

// get monthly Income from the order received from customers

router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
  const todaysDate = new Date()
  const LastMonth = new Date(todaysDate.setMonth(todaysDate.getMonth()-1));
  const PreviousMonth = new Date(new Date().setMonth(LastMonth.getMonth()-1));

  try{
    const income =await Order.aggregate([
      {$match: {createdAt: { $gte:PreviousMonth}}},
      {
        $project:{
          month:{$month:"$createdAt"},
          sales:"$amount",
        }},
      
        {
          $group :{
            _id:"$month",
            total:{$sum: "$sales"}

          }
        }

    ])
    res.status(200).json(income)


  }catch(err){
    res.status(500).json(err);
  }
})

   


module.exports=router