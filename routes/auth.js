const express=require('express');
const router=express.Router()
const User=require('../models/user');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_secret_key}=require('../keys')
const requireLogin=require('../middleware/requireLogin')


router.post('/signUp',(req,res)=>{
    const {name,email,password}=req.body
    if(!email || !password || !name)
    {
        res.status(422).json({error:"Please send all required fields"})
    }
    User.findOne({email:email}).
    then((savedUser)=>{
        if(savedUser)
        {
           return res.status(422).json({error:"user is already there"})
        }
        bcrypt.hash(password,12).
        then(hashedPassword=>{
            const user=new User({
                name,email,password:hashedPassword
            })
            user.save().
            then((user)=>{
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password)
    {
        return res.status(422).json({error:"please enter both the fields"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        {
            return res.status(422).json({error:"Invalid Username or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch)
            {
                const token=jwt.sign({_id:savedUser._id},JWT_secret_key)
                const {_id,name,email,followers,following,pic}=savedUser
                 res.status(200).json({token:token,user:{_id,name,email}})
            }
            else
            {
                return res.status(422).json({error:"Invalid Username or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports=router