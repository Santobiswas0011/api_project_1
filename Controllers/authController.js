
const RegistrationModel=require('../Model/authModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
// const { validationResult } = require('express-validator');


exports.regDataController=(req,res)=>{
     const firstName=req.body.firstName;
     const lastName=req.body.lastName;
     const email=req.body.email;
     const password=req.body.password; 
     console.log(firstName,lastName,email,password);

     if(!firstName){
         return res.status(401).json({
             success:false,
             message:"First  name is required"
         })
     }else if(!lastName){
        return res.status(401).json({
            success:false,
            message:"Last name is required"
        })
     }else if(!email){
        return res.status(401).json({
            success:false,
            message:"Email is required"
        })
     }else if(!password){
        return res.status(401).json({
            success:false,
            message:"Password is required"
        })
     }else{
        RegistrationModel.findOne({email:email})
        .then((userValue)=>{
            if(userValue){
               return res.status(401).json({
                   success:false,
                   message:"Email already exist"
               })
            }else{
               return bcrypt.hash(password,12).then((hashPassword)=>{
                   const userData=new RegistrationModel({
                      firstName:firstName,
                      lastName:lastName,
                      email:email,
                      password:hashPassword
                   })
                   return userData.save().then((results)=>{
                        return res.status(200).json({
                            success:true,
                            message:"Registration done",
                            result:results
                        })
                   }).catch((err)=>{
                    return res.status(401).json({
                        success:false,
                        message:err
                    })
                   })
               })
            }

        }).catch((err)=>{
            return res.status(401).json({
                success:false,
                message:err
            })
        }) 
     }

}

exports.loginController=(req,res)=>{
     const email=req.body.email;
     const password=req.body.password;

     if(!email){
        return res.status(401).json({
            success:false,
            message:"Email is required"
        })
    }else if(!password){
       return res.status(401).json({
           success:false,
           message:"Password is required"
       })
    }else{
        RegistrationModel.findOne({email:email})
        .then((userValue)=>{
            if(!userValue){
                return res.status(401).json({
                    success:false,
                    message:"Envalid Email"
                })
            }
            bcrypt.compare(password,userValue.password)
            .then((result)=>{
                if(!result){
                    return res.status(401).json({
                        success:false,
                        message:"Invalid password"
                    })
                }else{
                   console.log("Logged in",result);
                   req.session.isLoggedIn=true;
                   req.session.user=userValue;

                   return req.session.save((err)=>{
                        if(err){
                            return res.status(401).json({
                                success:false,
                                message:err
                            })
                        }else{
                            const token_jwt=jwt.sign({email:userValue.email},process.env.JWT_SECRET,{expiresIn:'1h'})
                            return res.status(201).json({
                                success:true,
                                message:"Login successfully",
                                toke:token_jwt
                            })
                        }
                   })
                } 
            })
        }).catch((err)=>{
            return res.status(401).json({
                success:false,
                message:err
            })
        })
    }

};

