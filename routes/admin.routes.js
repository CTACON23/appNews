const {Router} = require('express')
const User = require('../models/User')
const router = Router()

router.get('/',async(req,res) => {
    try {
        const editors = await User.find({})
        res.json({editors})
    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})
router.post('/aprove',async(req,res) =>{
    try {
        const {email} = req.body
        const user = await User.findOne({email})
                
        user.isApproved = !user.isApproved;
        await user.save()
        res.json({user})

    } catch (e) {
        res.status(500).json({message:'Something go wrong'})
    }
})

module.exports = router