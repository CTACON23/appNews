const {Router} = require('express')
const { check,validationResult} = require('express-validator')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth.middleware')
const router = Router()



router.post('/post',auth,
    [
        check('title','Enter a title!').isLength({min:1}),
        check('description','Enter a description!').isLength({min:1}),
        check('theme').exists()
    ],
    async(req,res) => {
    try {
        const errors  = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message:'Incorrect data due post created'
            })
        }
        
        const {title,description,theme} = req.body
        const post = new Post({title,description,theme,owner:req.user.userId})
        post.save()
        res.status(201).json({message:'Post is created. Wait for approve'})
    } catch (e){
        res.status(500).json({message:'Something go wrong'})
    }
    
})
router.get('/posts',auth,async(req,res)=>{
    try {
        const posts = await Post.find({owner:req.user.userId})
        res.json({posts})
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

router.post('/posts/delete',auth,async(req,res)=>{
    try {
        const {_id} = req.body
        const posts = await Post.deleteOne({_id})
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

router.post('/comment',
    [
        check('username','Enter a name!').isLength({min:1}),
        check('comment','Enter a comment!').isLength({min:1}),
        check('email','Enter a email!').normalizeEmail().isEmail()
    ],
    async(req,res)=>{
    try {
        const errors  = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message:'Incorrect data due auth'
            })
        }
        const {email,comment,username,post} = req.body
        const commentItem = new Comment({email,comment,username,post})
        await commentItem.save()
        res.status(201).json({message:'You leave the comment'})
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

module.exports = router