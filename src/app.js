require("dotenv").config();
const express=require("express");
require("./db/database")
const app= express();
const path = require("path");
const auth = require("./middleware/auth")
const jwt = require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bcrypt=require("bcryptjs");
const hbs = require("hbs");
const NewConnections=require("./models/models");
const port=process.env.PORT||5000;
const parcels=path.join(__dirname,"../templet/partials")
const views=path.join(__dirname,"../templet/views")
app.use(express.static(path.join(__dirname,"../public")))
app.set("view engine","hbs");
app.set("views",views);
app.use(express.json())
app.use(express.urlencoded({extended:false}))
hbs.registerPartials(parcels)
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.render("login")
 })

app.get("/home",auth,(req,res)=>{
   res.render("index")
})

app.get("/logout",auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((e)=>{
            return e.token !== req.token
        })
        res.clearCookie("jwt");
      await req.user.save();
        res.status(200).render("login")
    }catch(err){
        res.status(500).send(err)
    }
 })


app.get("/register",(req,res)=>{
   
    res.render("register")
})

app.get("/secret",auth,(req,res)=>{
   
    res.render("secret")
})

app.get("/logout",auth,async(req,res)=>{

})

app.post("/register",async(req,res)=>{
   
try{
    if(req.body.cpassword===req.body.password){
        const data=new NewConnections({
            fname:req.body.fname,
            lname:req.body.lname,
            phone:req.body.phone,
            email:req.body.email,
            gender:req.body.gender,
            password:req.body.password,
            Cpassword:req.body.cpassword,
            age:req.body.age
            })

            const token=await data.generateToken();

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+600000),
            httpOnly:true,
        })

            await data.save()
            res.render("login")
    }
}catch(err){
    res.status(500).send(err)

}
})

app.post("/",async (req,res)=>{
    try{
        
    const logPassword=req.body.password;
    const logemail=req.body.email;
    const databaseC=await NewConnections.findOne({email:logemail});
    const comparePass=await bcrypt.compare(logPassword,databaseC.password)
   const token= await databaseC.generateToken();

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+600000),
            httpOnly:true
        })
    if(comparePass){
        res.status(200).render("index")
    }else{
        res.status(500).render("login",{messages:"invalid logind diteals"})
    }
    }catch(err){
        res.render("login",{messages:"invalid logind diteals"})
    }
})


app.listen(port,()=>{
    console.log(`server is running port is ${port}`)
})