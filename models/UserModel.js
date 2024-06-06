const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    userName:{
        type:String,
        required:[true,"User Name is Mandatory"]
    },
    email:{
        type:String,
        required:[true,"Email is Mandatory"]
    },
    password:{
        type:String,
        required:[true,"Password is Mandatory"],
        minlength:8
    },
    age:{
        type:Number,
        required:[true,"Age is Mandatory"]
    }
},{timestamps:true})

const UserModel=mongoose.model('users',userSchema);

module.exports=UserModel;