const mongoose=require('mongoose');

const movieSchema=mongoose.Schema({

    title:{
        type:String,
        required:[true,"Title is Mandatory"]
        
    },
    image:{
        type:String,
        required:[true,"Image is Mandatory"]

    },
    description:{
        type:String,
        required:[true,"Description is Mandatory"]
    },
    genres:{
        type:String,
        required:[true,"Genres is Mandatory"]
    },
    duration:{
        type:String,
        required:[true,"Duration is Mandatory"]

    },
    releaseDate:{

        type:String,
        required:[true,"Release Date is Mandatory"]
 
    },
    language:{
        type:String,
        required:[true,"Language is Mandatory"]
    },
    moviezyRating:{
        type:Number,
        required:[true,"Moviezy is Mandatory"]

    }


},{timestamps:true})

const MoviesModel=mongoose.model('movies',movieSchema);

module.exports=MoviesModel;