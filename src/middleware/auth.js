const jwt = require("jsonwebtoken");
const NewConnections=  require("../models/models")
const auth = async (req,res,next)=>{
try{    
    const token=req.cookies.jwt;
    const veryUser= jwt.verify(token,process.env.SECRET_KEY);
    const user=await NewConnections.findOne({_id:veryUser._id});
    req.token=token;
    req.user=user;
    next();
}catch(err){
    res.status(500).send(`faild detials :- ${err}`)
}
}
module.exports = auth