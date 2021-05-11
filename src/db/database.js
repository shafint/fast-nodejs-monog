const mongoose = require("mongoose");
mongoose.connect(process.env.DB_LOCATION,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("Datebase connection sucessfully")
}).catch((error)=>{
    console.log(error)
})