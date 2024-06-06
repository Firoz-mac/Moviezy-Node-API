const mongoose=require('mongoose');

const favSchema=mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:[true,'Userid is mandatory']
    },
    movieId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'movies',
        required:[true,'Movieid is mandatory']
    },
    title:{
        type:String,
        required:[true,"Title is Mandatory"]
        
    },
    image:{
        type:String,
        required:[true,"Image is Mandatory"]

    }

},{timestamps:true})

const FavModel=mongoose.model('favorites',favSchema);
module.exports=FavModel;