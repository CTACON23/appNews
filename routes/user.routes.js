const {Router} = require('express')
const { check,validationResult} = require('express-validator')
const Post = require('../models/Post')
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

module.exports = router