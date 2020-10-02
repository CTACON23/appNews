const {Router} = require('express')
const { check, validationResult } = require('express-validator')
const config = require('config')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = Router()
const bcrypt = require('bcryptjs')

router.post('/register',
    [
        check('email','Incorrect email').isEmail(),
        check('password','Min pass length is 6 symb').isLength({min:6}),
        check('username','Required field').exists()
    ],
    async (req,res) => {
    try {
        
        const errors  = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message:'Incorrect data due registration'
            })
        }
        const {email,password,username} = req.body
        
        const candidate = await User.findOne({email})

        if(candidate){
            return res.status(400).json({message:'Editor is already exist'})
        }
        
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({email,password:hashedPassword,username})
        
        await user.save()
        res.status(201).json({message:'Editor is created'})

    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

router.post('/login',
    [
        check('email','Enter correct email').normalizeEmail().isEmail(),
        check('password','Enter pass').exists()
    ],
    async (req,res) => {
    try {
        const errors  = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message:'Incorrect data due auth'
            })
        }
        
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'Editor dont found'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        
        if(!isMatch){ 
            return res.status(400).json({message:'Wrong pass , try again'})
        }
          
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn:'1h'}
        )
        
        if(user.email == 'admin@admin.com'){
            
            return res.json({token,userId:user.id,isAdmin:true,username:user.username})
        }
        res.json({token,userId:user.id,username:user.username,isApproved:user.isApproved})
        
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

module.exports = router