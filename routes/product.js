const Product = require("../models/Product");
const  { verifyToken,verifyTokenAndAuthorization
  , verifyTokenAndAdmin } = require('./tokenVerification');
  const router = require('express').Router();

  //Create a product
  // done only by the admin
  // returned after a it's created successfully

  router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newProduct = new Product(req.body);

    try{
      const createdProduct = await newProduct.save()
      res.status(200).json(createdProduct)
    }catch (err){
       res.status(500).json(err)
    }
  })
  // Update a product
  // can only be done by an admin
  //returned after it's created

  router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,{
          $set: req.body,
        },
        {new:true}
      );
      res.status(200).json(updatedProduct)

    }catch(err){
      res.status(500).json(err)
    }
  })

  // delete a product
  //can only be done by an admin
  // returns a deletion message

  router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...")

    }catch(err){
      res.status(500).json(err)
    }
  })

  // Get a created product
  // can be done by everyone in the system

  router.get("/find/:id",async(req,res)=>{
    try{
      const product = await Product.findById(req.params.id)
      res.status(200).json(product)
    }catch(err){
      res.status(500).json(err)
    }
  })

  //get all products
  //everyone can get the products
  // returns all the products
  // uses two queries to filter them ie date and category

  router.get("/products",async(req,res)=>{
    const newQuery = req.query.new;
    const categoryQuery= req.query.category;

    try{
      let products;

      if (newQuery){
        // if it is a new query then the products obtained are;
        products = await Product.find().sort({createdAt: -1}).limit(10);//the products are found then sorted according to their
        //time stamps and then supplied in a limit of ten items
      }else if(categoryQuery){
        // if it is queried using a category  it fetches elements from the category table in the DB
        products = await Product .find({
          categories:{
            $in:[categoryQuery],
          },
        });

      }else{
        products = await Product.find();
      }
      res.status(200).json(products)


    }catch(err){

    }



  })

module.exports=router