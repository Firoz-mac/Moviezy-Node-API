
//middleman to check username and email

async function registerChecking(req,res,next){

    //import user model

    const UserModel=require('D:/programming/Projects/Moviezy/Moviezy/models/UserModel.js')
    

    let userInfo=req.body;
    console.log(userInfo.userName)

    try{
        let info=await UserModel.findOne({userName:userInfo.userName})

        if(info!==null){

            let info2= await UserModel.findOne({email:userInfo.email})

            if(info2==null){

                if(info!==null){

                    console.log('User Name Already Exist')
                    res.status(403).send({ message: 'User Name Already Exist' })

                }else{

                    next()

                }

            }
            else{
                console.log('Email Id Already Registerd')
                res.status(409).send({ message: 'Email Id Already Registerd' })
            }
        }
        else{

            next()

        }
    }
    catch(err){
        console.log(err)
        res.status(500).send({ message: 'Some Problem, try again' })
    }

    
    
}

module.exports=registerChecking;