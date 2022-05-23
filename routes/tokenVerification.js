const jwt = require("jsonwebtoken");

const verifyToken =(req,res,next)=>{
  const  authHeader = req.headers.token;

  if(authHeader){
    const token = authHeader.split(" ")[1]

    jwt.verify(token,process.env.jwt_key,(err,success)=>{
      if(err){
        res.status(403).json("Token is not valid!");
        req.success=success
        next()
      }
    })
  }else{
    return res.status(401).json("you're not verified")
  }

};
const verifyTokenAndAuthorization =(req,res,next)=>{
  verifyToken(req,res,()=>{
    if(req.success.id === req.params.id ||req.success.isAdmin){
      next()
    }else{
      res.status(403).json("you are not allowed to do that!")
    }
  })
};
const verifyTokenAndAdmin =(req,res,next)=>{
  verifyToken = (req,res,()=>{
    if(req.user.isAdmin){

      next()
    }else{
      res.status(403).json("you are not allowed to do that!")
    }
  })

}
module. exports ={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}
