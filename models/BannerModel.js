const mongoose=require('mongoose');

const BannerSchema=mongoose.Schema({

    image:{
        type:String,
        required:[true,"Image is Mandatory"]

    }

},{timestamps:true})

const BannerModel=mongoose.model('banners',BannerSchema);
module.exports=BannerModel;