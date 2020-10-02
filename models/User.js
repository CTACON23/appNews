const {Schema,model,Types} = require('mongoose')

const schema = new Schema({
    email:{type: String,unique:true,required:true},
    password:{type: String,required:true},
    username:{type: String,required:true},
    posts: [{type:Types.ObjectId,ref:'Post'}],
    isApproved:{type:Boolean,default:'false'},
    date:{type:Date,default:Date.now}
})

module.exports = model('User',schema)