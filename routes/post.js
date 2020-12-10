const express=require('express');
const router=express.Router()
const Post=require('../models/post')
const requireLogin=require('../middleware/requireLogin')

router.get('/allPosts',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.send({post:posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/createPost',requireLogin,(req,res)=>{
    const {title,body,pic}=req.body
    console.log(title,body,pic)
    if(!title || !body || !pic)
    {
        return res.status(422).json({error:"Please add all the details"})
    }
    const post=new Post({
        title,body,photo:pic,postedBy:req.user
    })
    post.save().then(result=>{
            res.send({post:result})
        })
        .catch(err=>{
            console.log(err)
        })
})

router.get('/myPosts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myPost=>{
        res.send({myPost})
    })
    .catch(err=>{
        console.log(err)
    })
}) 
router.delete('/deletePost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post)
        {
            res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString())
        {
            post.remove()
            .then(result=>{
                res.json(result)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})


module.exports=router