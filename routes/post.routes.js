const {Router} = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const router = Router()

router.get('/detail/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        const comments = await Comment.find({post:req.params.id}).sort({$natural:-1})
        res.json({post,comments})
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

router.get('/',async(req,res)=>{
    try {  
        const editors = await User.find({})
        const posts = await Post.find({isApproved:true}).lean().sort({$natural:-1})
        for(var i= 0;i<posts.length;i++){
            for(var j = 0; j<editors.length;j++){
                if(posts[i].owner.toString() === editors[j]._id.toString()){
                    posts[i].username = editors[j].username
                }
            }
        }
        res.json({posts})
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})


module.exports = router