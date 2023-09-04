const mongoose=require('mongoose')
//using passport to extend funtionality
const plm = require('passport-local-mongoose');
//iii
const userSchema=new mongoose.Schema({
    email:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }

})

userSchema.plugin(plm)

module.exports=mongoose.model("User", userSchema)