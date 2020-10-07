const {Router} = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const router = Router()

router.get('/',async(req,res) => {
    try {
        const editors = await User.find({})
        const posts = await Post.find({}).lean().sort({$natural:-1})
        for(var i= 0;i<posts.length;i++){
            for(var j = 0; j<editors.length;j++){
                if(posts[i].owner.toString() === editors[j]._id.toString()){
                    posts[i].username = editors[j].username
                }
            }
        }
        res.json({editors,posts})
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})
router.post('/aprove',async(req,res) =>{
    try {
        const {email,postId} = req.body
        console.log(req.body)
        if(email!=null){
            const user = await User.findOne({email})
                    
            user.isApproved = !user.isApproved;
            await user.save()
            return res.json({user})
        }else{
            const post = await Post.findOne({_id:postId})
            
            post.isApproved = !post.isApproved;
            await post.save()
            res.json({post})
        }

    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

module.exports = router