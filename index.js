const express =require('express');
const mongoose = require('mongoose');

//bcrypt for password encrypting
const bcrypt = require('bcrypt');
const saltRounds = 10;

//for token
const jwt = require('jsonwebtoken');


//for handling cors
const cors=require('cors');



//import user model

const UserModel=require('./models/UserModel')


//import movies model
const MoviesModel=require('./models/MovieModel')

//import Favorite Model

const FavModel=require('./models/FavModel')

//import banner model

const BannerModel=require('./models/BannerModel')

//import watchlist module

const WatchlistModel=require('./models/WatchlistModel')

//import token verification middleman

const verifyToken=require('./middleMan/verifyToken')

//import resgistration checking middleman

const registerChecking=require('./middleMan/registerChecking')



//data base connection

mongoose.connect('mongodb://localhost:27017/moviezy')
    .then(()=>{

        console.log('Data base connection successfull')

    })
    .catch((err)=>{
        console.log(err)
    })




//server creation

const app = express();
app.use(express.json());
app.use(cors()); //for handling cors

app.listen(8000, () => {
    console.log('Server is up and Running')
})




//End-Point For User Registration

app.post('/register',registerChecking,(req,res)=>{

    const userData=req.body
    console.log(req.body)

    bcrypt.genSalt(saltRounds,async (err,salt)=>{

        if(!err){

            bcrypt.hash(userData.password,salt, async(err,hashedPassword)=>{

                if(!err){

                    userData.password=hashedPassword;

                    try{

                        let data= await UserModel.create(userData)
                        res.status(200).send({message:'Registration Successfull'})

                    }
                    catch(err){
                        console.log(err)
                        res.status(500).send({message:'Some Problem, try again'})
                    }

                }else{

                    console.log(err)
                    res.status(500).send({message:'Some Problem, try again'})


                }
            })

        }else{
            console.log(err)
            res.status(500).send({message:'Some Problem, try again'})
        }

    })


})


//end point for user login

app.post('/login',async (req,res)=>{

    const loginData=req.body


    try{
        const info= await UserModel.findOne({email:loginData.email})


        if(info!==null){


            bcrypt.compare(loginData.password,info.password,(err,result)=>{

                if(result==true){

                    jwt.sign({email:info.email},"moviezy",(err,token)=>{
                    
                        if(!err){
    
                            res.status(207).send({message:'Login Success',token:token,name:info.name,userId:info._id})
                            console.log('Login Success')
    
                        }else{
                            console.log(err)
                            res.send({message:'Some Problem, try again'})
                        }
                    })

                }else{

                    res.status(401).send({message:'Incorrect Password'})

                }

            })

        }else{

            res.status(404).send({message:'User Not Found'})
        }
    }
    catch(err){

        console.log(err)
        res.status(500).send({message:'Some Problem, try again'})

    }

    

    
})

// end point for get movies data
app.get('/movies',async(req,res)=>{

    try{

        const movies = await MoviesModel.find()
        res.send(movies)

    }
    catch(err){

        console.log(err)
        res.send({message:'cant find data'})
    }

    

})

//end point search movie by name

app.get('/movies/:title',async(req,res)=>{

    try{

        let movie= await MoviesModel.find({title:{$regex:req.params.title,$options:'i'}})

        if(movie.length!==0){
            res.send(movie)
        }else{
            res.status(404).send({message:'Movie Not Found'})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).send({message:'Some Problem Getting Movie'})
    }
})

//end point for show selectd movie detals
app.get('/movieDetail/:id',async(req,res)=>{

    try{
        let movie= await MoviesModel.findOne({_id:req.params.id})
        if(movie!=null){
            res.send(movie)
        }
        else{
            res.status(404).send({message:'Movie Not Found'})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).send({message:'Some Problem Getting Movie'})

    }
})

//end point for set movies to favorite list

app.post('/movies/favorite',verifyToken, async (req,res)=>{

    let favmovie=req.body

    try{

        let data = await FavModel.create(favmovie)
        res.status(201).send({message:'Added To Favorite'})
        
    }
    catch(err){
        console.log(err)
        res.status(500).send({message:'Some Problem, Try Again'})

    }
})

//end point for get favorited move list

app.get('/moviezy/favorite/:userId',verifyToken,async(req,res)=>{

    let userData=req.params.userId

    try{

        let favMovies= await FavModel.find({userId:userData})

        if(favMovies.length!==0){

            res.send(favMovies)
            console.log("Got Favorite list")

        }
        else{
            console.log('some problem in getting favorite list')
        }


    }
    catch(err){
        console.log(err)
        res.status(500).send({message:'Some Problem, Try Again'})
    }
})


//end point to sett watchlist
app.post('/moviezy/watchlist',verifyToken,async (req,res)=>{

    const watchlistedMovie=req.body

    try{

        let data= await WatchlistModel.create(watchlistedMovie)
        res.status(201).send({message:'Added To Watchlist'})

    }
    catch(err){
        console.log(err)
    }
})


//end point to get all watchlisted movies

app.get('/moviezy/watchlist/:userId',verifyToken,async(req,res)=>{

    let userData=req.params.userId

    try{

        let watchlistedItems=await WatchlistModel.find({userId:userData})

        if(watchlistedItems.length!==0){
            res.send(watchlistedItems)
            console.log('Got Watchlisted Movies')

        }else{
            res.status(404).send({message:'No Watchlisted Movies',status:'404'})
        }
        
    }
    catch(err){

        console.log(err)

    }
})


// end point to add banners
app.post('/moviezy/banner/add',async(req,res)=>{

    const banner=req.body

    try{

        let data=await BannerModel.create(banner)
        res.status(201).send({message:'Banner Added'})

    }
    catch(err){
        console.log(err)
    }
})

// end point to get banners

app.get('/moviezy/banner/get',async(req,res)=>{

    try{
        let banners=await BannerModel.find()
        res.send(banners)
    }
    catch(err){
        console.log(err)
        res.send({message:'some proble while getting banner img'})
    }
})

//end point to add movies to data for admin

app.post('/admin',async(req,res)=>{

    try{
        let newMovieDetail=req.body

        let data=await MoviesModel.create(newMovieDetail)

        res.send({message:'New Movie Added'})
        console.log('New Movie Added')
        
    }
    catch(err){
        console.log(err)
        res.send({message:'Some Problem While Adding New Movie'})
    }
})