const mongoose=require("mongoose");
const validator=require("validator")
const bcrypt=require("bcryptjs");
const jws = require("jsonwebtoken");
const dataSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is Invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true
    },
    Cpassword:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})


dataSchema.methods.generateToken=async function(){
  try{ 
      const token= jws.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
    this.tokens= this.tokens.concat({token:token});
    await this.save()
    return token
    }catch(err){
        res.status(500).send(err)
    }
}



// hash pass
dataSchema.pre("save",async function(next){
    if(this.isModified("password")){
        const hasingPass=await bcrypt.hash(this.password,10)
        const hasingCPass=await bcrypt.hash(this.Cpassword,10)
        this.password=hasingPass;
        this.Cpassword=hasingCPass;
        console.log(this.password)
        next();
    }
})


const NewConnections=new mongoose.model("NewConnections",dataSchema);

module.exports = NewConnections;